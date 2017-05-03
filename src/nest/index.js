const EventEmitter = require('events'),
  EventSource = require('eventsource'),
  moment = require('moment'),
  Logger = require('../Logger'),
  logger = new Logger('nest'),
  getGlobalConfig = require('../config').get,
  defaultApiUri = 'https://developer-api.nest.com';

let accessToken = getGlobalConfig('nest', 'accessToken'),
  apiUri = defaultApiUri,
  emitter = new EventEmitter();

nest();

async function nest () {
  let nestService = new EventSource(apiUri, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  nestService.addEventListener('put', handlePut);
  nestService.addEventListener('cancel', event => logger.log('Got a cancel event. Not sure what this means.', JSON.stringify(event)));
  nestService.addEventListener('auth_revoked_event', event => logger.log('Auth was revoked!', JSON.stringify(event)));

  nestService.onerror = function (error) {
    logger.log('Got an error:', JSON.stringify(error));
  };
}

function handlePut (event) {
  let data = JSON.parse(event.data),
    eventData = data.data,
    cameras = eventData.devices.cameras;

  for (let [cameraId, camera] of Object.entries(cameras)) {
    if (hasNewEvent(camera)) {
      emitEvents(camera);
    }
  }
}

let previousCameraEvents = {};

function hasNewEvent (camera) {
  let cameraId = camera['device_id'],
    lastEvent = getLastEvent(camera),
    startTime = moment(lastEvent['start_time']),
    minutesSinceLastEvent = moment().diff(startTime, 'minutes'),
    lastRecordedEvent = previousCameraEvents[cameraId];

  if ((
      !lastRecordedEvent ||
      lastRecordedEvent['start_time'] < lastEvent['start_time']
    ) &&
    minutesSinceLastEvent < 2
  ) {
    previousCameraEvents[cameraId] = lastEvent;

    return true;
  }

  return false;
}

function emitEvents (camera) {
  let lastEvent = getLastEvent(camera);

  if (lastEvent.has_person) {
    emitter.emit('person', camera);
  }

  if (lastEvent.has_motion) {
    emitter.emit('motion', camera);
  }

  if (lastEvent.has_sound) {
    emitter.emit('sound', camera);
  }
}

function getLastEvent (camera) {
  return camera['last_event'];
}

module.exports = emitter;
