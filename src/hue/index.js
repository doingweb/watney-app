const { HueApi, lightState, lights, groups } = require('node-hue-api'),
  awaitableWrap = require('./awaitableWrap'),
  getGlobalConfig = require('../config').get;

const onState = lightState.create().on(),
  offState = lightState.create().off();

let config = getGlobalConfig('hue'),
  { host, username } = config,
  api = new HueApi(host, username);

module.exports.rawNodeHueApi = api;
module.exports.config = config;

module.exports.getLights = function getLights () {
  return config.lights;
};

module.exports.getLightGroups = function getLightGroups () {
  return config.lightGroups;
};

module.exports.lightOn = async function lightOn (lightId, brightness, transitionSeconds) {
  await setLightState(lightId, getOnState(brightness, transitionSeconds));
};

module.exports.lightOff = async function lightOff(lightId, transitionSeconds) {
  await setLightState(lightId, getOffState(transitionSeconds));
};

module.exports.lightGroupOn = async function lightGroupOn (groupId, brightness, transitionSeconds) {
  await setLightGroupState(groupId, getOnState(brightness, transitionSeconds));
};

module.exports.lightGroupOff = async function lightGroupOff(groupId, transitionSeconds) {
  await setLightGroupState(groupId, getOffState(transitionSeconds));
};

async function setLightState (lightId, state) {
  await awaitableWrap(api.setLightState(lightId, state));
}

async function setLightGroupState (groupId, state) {
  await awaitableWrap(api.setGroupLightState(groupId, state));
}

function getOnState (brightness, transitionSeconds) {
  let state = onState;

  if (brightness !== undefined) {
    state = state.bri(brightness * 255);
  }

  if (transitionSeconds !== undefined) {
    state = state.transitiontime(transitionSeconds * 10);
  }

  return state;
}

function getOffState (transitionSeconds) {
  let state = onState;

  if (transitionSeconds !== undefined) {
    state = state.transitiontime(transitionSeconds * 10);
  }

  return state;
}
