const { EventEmitter } = require('events');

const Logger = require('./Logger');

module.exports = class WatneyPlugin extends EventEmitter {
  static get id() {
    return 'unknown-plugin';
  }

  static get description() {}

  static get cli() {
    return async function noCli() {
      console.log('Sorry, no CLI is defined for this plugin.');
    };
  }

  /**
   * Creates an instance of a WatneyPlugin.
   *
   * Saves the config and sets up a Logger.
   *
   * @param {Object} config The plugin's configuration.
   */
  constructor(config) {
    super();

    this.config = config;
    this.logger = new Logger(this.constructor.id);
  }

  async init() {
    this.logger.log('Plugin initialized.');
  }
};
