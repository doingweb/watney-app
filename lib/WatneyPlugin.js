const { EventEmitter } = require('events');
const { promisify } = require('util');
const mkdirp = promisify(require('mkdirp'));
const path = require('path');

const Loki = require('lokijs');

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

    this.config = config || {};
    this.logger = new Logger(this.constructor.id);
  }

  get db() {
    // Getters cannot be async, so we need to return a promise instead.
    return (async () => {
      if (this._db) {
        return this._db;
      }

      const dbPath = path.join(
        process.cwd(),
        '.plugin-db',
        `${this.constructor.id}.db`
      );

      await mkdirp(path.dirname(dbPath));

      await new Promise(resolve => {
        this._db = new Loki(dbPath, {
          autoload: true,
          autoloadCallback: resolve,
          autosave: true
        });
      });

      return this._db;
    })();
  }

  async init() {
    this.logger.log('Plugin initialized.');
  }
};
