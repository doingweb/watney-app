#!/usr/bin/env node
// tslint:disable:no-console

import * as inquirer from 'inquirer';

import * as fs from 'fs';
import * as path from 'path';

import { WatneyApp } from '../lib/WatneyApp';

(async function main() {
  const appModulePath = await getAppModulePath();

  const app = (await import(appModulePath)).default as WatneyApp;

  const pluginKeys = Array.from(app.plugins.keys());

  const selectPlugin = {
    choices: [...pluginKeys, new inquirer.Separator(), 'Exit'],
    message: 'Run command-line interface for plugin',
    name: 'pluginId',
    type: 'list'
  };

  while (true) {
    const { pluginId } = await inquirer.prompt<{ pluginId: string }>(
      selectPlugin
    );

    if (pluginId === 'Exit') {
      return;
    }

    const plugin = app.plugins.get(pluginId);
    if (!plugin) {
      console.log(`Huh. Plugin "${pluginId}" not found... Starting over.`);
      continue;
    }

    await plugin.cli.run(app);

    const { returnToMenu } = await inquirer.prompt<{ returnToMenu: boolean }>({
      default: true,
      message: 'Return to plugins menu?',
      name: 'returnToMenu',
      type: 'confirm'
    });

    if (!returnToMenu) {
      process.exit();
    }
  }
})();

async function getAppModulePath() {
  try {
    const appRoot = process.cwd();
    const appPackageFilePath = path.join(appRoot, 'package.json');
    const appPackageFile = await fs.promises.readFile(
      appPackageFilePath,
      'utf8'
    );
    const appPackageData = await JSON.parse(appPackageFile);
    return path.join(appRoot, appPackageData.watney.app);
  } catch {
    throw new Error(
      'Unable to get the app module path. Make sure the `watney` block is properly configured in package.json.'
    );
  }
}
