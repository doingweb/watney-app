const fs = require('fs'),
  yaml = require('js-yaml'),
  path = require('path'),
  configFilename = path.join(__dirname, '..', '..', 'config.yaml');

let configFile = fs.readFileSync(configFilename, 'utf8');
let config = yaml.safeLoad(configFile);

/**
 * Gets a given config value.
 *
 * @param {...string} path - The property path to the desired value(s).
 * @returns {any} - The config value at the path, or `undefined` if not found.
 */
module.exports.get = function get (...path) {
  let result = config;
  for (let part of path) {
    result = result[part];

    if (!result) {
      return;
    }
  }

  return result;
}
