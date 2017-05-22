Day Events
==========

`EventEmitter` and calculator for daily events like sunrise, sunset, dawn, dusk, etc.

Configuration
-------------

Latitude and longitude must be configured in the `config.yaml`:

```yaml
location:
  latitude: 45.5231
  longitude: -122.6765
```

Events
------

The `emitter` will emit events as they happen, in real time. The events [come from the SunCalc library](https://github.com/mourner/suncalc#sunlight-times) and documented constants are included with the plugin.

The exact times of the events for the current day can be retrieved using the `getTimes()` method.

Example
-------

```js
const { emitter, getTimes } = require('../src/day-events'),
  { SUNSET, SUNRISE } = require('../src/day-events/event-names');

emitter.on(SUNRISE, () => console.log('Good morning!'));
emitter.on(SUNSET, () => console.log('Good evening!'));

let eventTimes = getTimes();
console.log('Sunset is at', eventTimes[SUNSET].toString());
```
