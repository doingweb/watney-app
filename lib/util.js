/**
 * Pauses execution for a specified period of time.
 *
 * @param {number} ms The number of milliseconds to wait.
 * @returns {Promise} An awaitable Promise for the end of the pause.
 */
module.exports.sleep = function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
