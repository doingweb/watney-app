const { HueApi, lightState, lights, groups } = require('node-hue-api'),
  Logger = require('../Logger'),
  logger = new Logger('hue'),
  awaitableWrap = require('./awaitableWrap'),
  getGlobalConfig = require('../config').get;

let config = getGlobalConfig('hue'),
  { host, username } = config,
  api = new HueApi(host, username);

module.exports.rawNodeHueApi = api;
module.exports.config = config;

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

module.exports.getLightState = async function getLightState (lightId) {
  let light = await awaitableWrap(api.getLightStatus(lightId));
  return light.state;
};

module.exports.getLightGroupLastAction = async function getLightGroupLastAction (groupId) {
  let lightGroup = await awaitableWrap(api.getGroup(groupId));
  return lightGroup.lastAction;
};

module.exports.setLightState = setLightState;
module.exports.setLightGroupState = setLightGroupState;

async function setLightState (lightId, state) {
  logger.log(`Changing state of light ${lightId} to ${JSON.stringify(state)}.`);
  try {
    await awaitableWrap(api.setLightState(lightId, state));
    logger.log(`Light ${lightId} state successfully changed.`);
  }
  catch (error) {
    logger.log(`Error changing state of light ${lightId}: ${error}`);
  }
}

async function setLightGroupState (groupId, state) {
  logger.log(`Changing state of light group ${groupId} to ${JSON.stringify(state)}.`);
  try {
    await awaitableWrap(api.setGroupLightState(groupId, state));
    logger.log(`Light group ${groupId} state successfully changed.`);
  } catch (error) {
    logger.log(`Error changing state of light group ${groupId}: ${error}`);
  }
}

function getOnState (brightness, transitionSeconds) {
  let state = lightState.create().on();

  if (brightness !== undefined) {
    state = state.bri(brightness * 255);
  }

  if (transitionSeconds !== undefined) {
    state = state.transitiontime(transitionSeconds * 10);
  }

  return state;
}

function getOffState (transitionSeconds) {
  let state = lightState.create().off();

  if (transitionSeconds !== undefined) {
    state = state.transitiontime(transitionSeconds * 10);
  }

  return state;
}
