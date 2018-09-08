#!/usr/bin/env node

const inquirer = require('inquirer');

const path = require('path');
const app = require(path.join(process.cwd(), 'app'));

const pluginKeys = Array.from(app.plugins.keys());

const selectPlugin = {
  name: 'pluginId',
  message: 'Run command-line interface for plugin',
  type: 'list',
  choices: [...pluginKeys, new inquirer.Separator(), 'Exit']
};

(async function main() {
  while (true) {
    let { pluginId } = await inquirer.prompt(selectPlugin);

    if (pluginId === 'Exit') {
      return;
    }

    let plugin = app.plugins.get(pluginId);
    await plugin.constructor.cli(app);

    let { returnToMenu } = await inquirer.prompt({
      name: 'returnToMenu',
      type: 'confirm',
      message: 'Return to plugins menu?',
      default: true
    });

    if (!returnToMenu) {
      process.exit();
    }
  }
})();
