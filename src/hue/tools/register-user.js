const api = require('../lib/api'),
  { host, userDescription } = require('../../config').get('hue'),
  awaitableWrap = require('../lib/awaitableWrap'),
  { sleep } = require('../../util');

registerUser();

async function registerUser () {
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
