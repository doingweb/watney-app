const fs = require('mz').fs,
  path = require('path'),
  scriptsDir = path.join(__dirname, 'scripts');

runScripts();

async function runScripts () {
  let allFiles = await fs.readdir(scriptsDir),
    jsFiles = allFiles.filter(fileName => fileName.endsWith('.js'));

  for (let fileName of jsFiles) {
    require(path.join(scriptsDir, fileName))();
  }
}
