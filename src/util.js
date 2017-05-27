const path = require('path'),
  Logger = require('./Logger');

/**
 * Pauses execution for a specified period of time.
 *
 * @param {number} ms The number of milliseconds to wait.
 * @returns {Promise} An awaitable Promise for the end of the pause.
 */
module.exports.sleep = function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates a new Logger for a script with the given filename.
 *
 * @param {string} filename The name of the script file (with extension).
 * @returns A new Logger for the script.
 */
module.exports.createScriptLogger = function createScriptLogger (filename) {
  return new Logger(path.basename(filename, '.js'));
};
