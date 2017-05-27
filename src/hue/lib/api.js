const { HueApi } = require('node-hue-api'),
  getGlobalConfig = require('../../config').get;

let config = getGlobalConfig('hue'),
  { host, username } = config;

module.exports = new HueApi(host, username);
