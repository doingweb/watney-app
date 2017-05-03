const request = require('request-promise-native'),
  readline = require('mz/readline'),
  moment = require('moment'),
  { clientId, clientSecret } = require('../../src/config').get('nest'),
  uri = 'https://api.home.nest.com/oauth2/access_token',
  authorizationUrl = `https://home.nest.com/login/oauth2?client_id=${clientId}&state=STATE`,
  cli = readline.createInterface(process.stdin, process.stdout);

getAccessToken();

async function getAccessToken () {
  console.log(`Go to ${authorizationUrl} to authorize Watney and get an authorization (PIN) code.`);

  let pin = await cli.question('PIN: ');

  cli.close();

  console.log('Requesting access token from Nest using provided PIN...');

  try {
    let token = await requestToken(pin);

    let accessToken = token['access_token'],
      timeToLive = moment.duration(token['expires_in'], 'seconds');

    console.log('Received access token:', accessToken);
    console.log('Expires after:', timeToLive.humanize());

    console.log('Save this token in your config to enable the Nest plugin.');
  } catch (error) {
    console.error(error.message);
  }
}

async function requestToken (authorizationCode) {
  return await request({
    uri: uri,
    method: 'POST',
    form: {
      'client_id': clientId,
      'client_secret': clientSecret,
      code: authorizationCode,
      'grant_type': 'authorization_code'
    },
    transform: body => JSON.parse(body)
  });
}
