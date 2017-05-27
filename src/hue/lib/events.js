const EventEmitter = require('events');

/**
 * Emits events about light state changes.
 */
module.exports.emitter = new EventEmitter();

/**
 * An individual light bulb's state was changed.
 */
module.exports.LIGHT_STATE_CHANGE = Symbol();

/**
 * The collective state of a group of lights was changed.
 */
module.exports.LIGHT_GROUP_STATE_CHANGE = Symbol();
