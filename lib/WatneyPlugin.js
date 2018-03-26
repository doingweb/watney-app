const Logger = require('./Logger');

module.exports = class WatneyPlugin {
  static get id() {
    return 'unknown-plugin';
  }
  static get description() {}

  /**
   * Creates an instance of a WatneyPlugin.
   *
   * Saves the config and sets up a Logger.
   *
   * @param {Object} config The plugin's configuration.
   */
  constructor(config) {
    this.config = config;

    this.logger = new Logger(this.constructor.id);
  }

  async init() {
    this.logger.log('Plugin initialized.');
  }
};
