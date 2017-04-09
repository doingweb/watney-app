module.exports = class Logger {
  constructor (sourceName) {
    this.sourceName = sourceName;
  }

  log (message) {
    console.log(`${this.sourceName} > ${message}`);
  }
};
