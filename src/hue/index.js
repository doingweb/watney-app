const { HueApi, lightState, lights, groups } = require('node-hue-api'),
  awaitableWrap = require('./awaitableWrap'),
  getGlobalConfig = require('../config').get;

const onState = lightState.create().on(),
  offState = lightState.create().off();

let config, api;

async function loadConfig () {
  config = await getGlobalConfig('hue');
}

async function getConfig () {
  if (!config) {
    await loadConfig();
  }

  return config;
}

async function getApi () {
  if (!api) {
    let { host, username } = await getConfig();
    api = new HueApi(host, username);
  }

  return api;
}

module.exports.getRawNodeHueApi = getApi;
module.exports.getConfig = getConfig;

module.exports.getLights = async function getLights () {
  return { lights } = await getConfig();
};

module.exports.getLightGroups = async function getLightGroups () {
  return { lightGroups } = await getConfig();
};

module.exports.lightOn = async function lightOn (lightId, brightness) {
  await setLightState(lightId, getOnStateWithBrightness(brightness));
};

module.exports.lightOff = async function lightOff(lightId) {
  await setLightState(lightId, offState);
};

module.exports.lightGroupOn = async function lightGroupOn (groupId, brightness) {
  await setLightGroupState(groupId, getOnStateWithBrightness(brightness));
};

module.exports.lightGroupOff = async function lightGroupOff(groupId) {
  await setLightGroupState(groupId, offState);
};

async function setLightState (lightId, state) {
  let api = await getApi();

  await awaitableWrap(api.setLightState(lightId, state));
}

async function setLightGroupState (groupId, state) {
  let api = await getApi();

  await awaitableWrap(api.setGroupLightState(groupId, state));
}

function getOnStateWithBrightness (brightness) {
  let state = onState;

  if (brightness !== undefined) {
    state = state.bri(brightness);
  }

  return state;
}
