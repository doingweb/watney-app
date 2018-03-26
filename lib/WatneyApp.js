const config = require('config');
const Logger = require('./Logger');

// TODO: Write tests once we've figured out how exactly to go about this.

module.exports = class WatneyApp {
  constructor({ plugins, scripts }) {
    this.logger = new Logger('watney-app');

    this.logger.log("It's good to be home.");

    this.config = config;

    this.plugins = new Map();
    for (const Plugin of plugins) {
      this.plugins.set(Plugin.id, new Plugin(this.config.get(Plugin.id)));
    }

    this.scripts = new Map();
    for (const Script of scripts) {
      this.scripts.set(Script.id, new Script());
    }
  }

  async start() {
    this.logger.log('Starting up!');
    this.logger.log('Initializing plugins.');

    let pluginsInitialized = [];
    this.plugins.forEach(p => pluginsInitialized.push(p.init()));
    await Promise.all(pluginsInitialized);

    this.logger.log('Running scripts.');

    this.scripts.forEach(s => s.run(this));
  }
};
