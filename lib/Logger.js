module.exports = class Logger {
  constructor (sourceName) {
    this.sourceName = sourceName;
  }

  log () {
    console.log(`[${this.sourceName}]`, ...arguments);
  }
};
