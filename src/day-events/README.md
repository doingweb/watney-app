Day Events
==========

`EventEmitter` and calculator for daily events like sunrise, sunset, dawn, dusk, etc.

Events
------

The names for these times [come from the SunCalc library](https://github.com/mourner/suncalc#sunlight-times).

* `nightEnd`
* `nauticalDawn`
* `dawn`
* `sunrise`
* `sunriseEnd`
* `goldenHourEnd`
* `solarNoon`
* `goldenHour`
* `sunsetStart`
* `sunset`
* `dusk`
* `nauticalDusk`
* `night`
* `nadir`

Example
-------

```js
const { emitter, getTimes } = require('../src/day-events');

emitter.on('sunrise', () => console.log('Good morning!'));
emitter.on('sunset', () => console.log('Good evening!'));

let eventTimes = getTimes();
console.log('Sunset is at', eventTimes['sunset'].toString());
```
