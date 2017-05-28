const EventEmitter = require('events'),
  { scheduleJob } = require('node-schedule'),
  moment = require('moment'),
  SunCalc = require('suncalc'),
  config = require('../config'),
  location = config.get('location'),
  emitter = new EventEmitter();

module.exports.emitter = emitter;
module.exports.getTimes = getTimes;
module.exports.eventNames = require('./event-names');

scheduleTodaysEvents();
scheduleJob(getJobName('scheduleEventJobs'), '0 0 0 * * *', scheduleTodaysEvents);

function scheduleTodaysEvents () {
  let eventTimes = getTimes();

  for (let eventName in eventTimes) {
    scheduleJob(
      getEventJobName(eventName),
      eventTimes[eventName],
      () => emitter.emit(eventName)
    );
  }
}

/**
 * Get today's day event times.
 *
 * @returns {Object} The day events, mapping event names to times.
 */
function getTimes () {
  // Use today's noon, since just after midnight may still return yesterday's dates.
  // See https://github.com/mourner/suncalc/issues/11
  return SunCalc.getTimes(moment({ hour: 12 }), location.latitude, location.longitude);
}

function getEventJobName (eventName) {
  return getJobName('emitter-' + eventName);
}

function getJobName (name) {
  return 'day-phase-' + name;
}
