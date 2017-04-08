const api = require('../../src/hue').rawNodeHueApi,
  awaitableWrap = require('../../src/hue/awaitableWrap');

printAll();

async function printAll () {
  let lights = await awaitableWrap(api.lights());
  let groups = await awaitableWrap(api.groups());

  console.log('Lights', JSON.stringify(lights, null, 2));
  console.log('Groups', JSON.stringify(groups, null, 2));
}
