/**
 * Wraps the promises used by node-hue-api in a native promise.
 *
 * @param {Object} huePromise
 * @returns {Promise} An awaitable native Promise.
 */
module.exports = function awaitableWrap (huePromise) {
  return new Promise((resolve, reject) => {
    huePromise
      .then(resolve)
      .fail(reject)
      .done();
  });
}
