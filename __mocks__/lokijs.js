module.exports = jest.fn().mockImplementation((dbPath, options) => {
  const { autoloadCallback } = options;

  if (autoloadCallback) {
    autoloadCallback();
  }
});
