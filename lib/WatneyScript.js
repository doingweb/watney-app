const Logger = require('./Logger');

module.exports = class WatneyScript {
  static get id() {
    return 'unknown-script';
  }

  constructor() {
    this.logger = new Logger(this.constructor.id);
  }
};
