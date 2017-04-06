const { HueApi } = require('node-hue-api'),
  { getConfig } = require('../../src/hue'),
  awaitableWrap = require('../../src/hue/awaitableWrap'),
  { sleep } = require('../../src/util');

let api = new HueApi();

registerUser();

async function registerUser () {
  let { host, userDescription } = await getConfig();

  console.log('Press the link button on the thing...');

  let retriesLeft = 6;

  while (retriesLeft--) {
    await sleep(5000);

    try {
      let newUser = await awaitableWrap(api.registerUser(host, userDescription));
      console.log('New User', JSON.stringify(newUser));
      return;
    }
    catch (error) {
      console.log(`[${error.message}] Retrying ${retriesLeft} more times...`);
    }
  }
}
