const { lightState } = require('node-hue-api');

module.exports.getOnState = function getOnState (brightness, transitionSeconds) {
  let state = lightState.create().on();

  if (brightness !== undefined) {
    state = state.bri(brightness * 255);
  }

  if (transitionSeconds !== undefined) {
    state = state.transitiontime(transitionSeconds * 10);
  }

  return state;
}

module.exports.getOffState = function getOffState (transitionSeconds) {
  let state = lightState.create().off();

  if (transitionSeconds !== undefined) {
    state = state.transitiontime(transitionSeconds * 10);
  }

  return state;
}
