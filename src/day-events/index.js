const EventEmitter = require('events'),
  { scheduleJob } = require('node-schedule'),
  moment = require('moment'),
  SunCalc = require('suncalc'),
  config = require('../config');

let location = config.get('location'),
  emitter = new EventEmitter(),
  todaysEventJobs;

module.exports.emitter = emitter;
module.exports.getTimes = getTimes;

scheduleTodaysEvents();
scheduleJob(getJobName('scheduleEventJobs'), '0 0 0 * * *', scheduleTodaysEvents);

function scheduleTodaysEvents () {
  todaysEventJobs = {};

  let eventTimes = getTimes();

  for (let eventName in eventTimes) {
    let eventTime = eventTimes[eventName];
    todaysEventJobs[eventName] = scheduleJob(
      getEventJobName(eventName),
      eventTime,
      () => emitter.emit(eventName)
    );
  }
}

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
