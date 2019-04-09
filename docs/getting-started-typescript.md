Getting Started (using TypeScript)
==================================

Your Watney project is like any other TypeScript project. Start with an empty directory and initialize `npm`:

```console
npm init
```

Then, install `watney-app`:

```console
npm install watney-app
```

Followed by your TypeScript dev dependendencies:

```console
npm install --save-dev typescript tslint prettier tslint-plugin-prettier tslint-config-prettier
```

Go ahead and set up your `tsconfig.json`, `tslint.json`, and other TypeScript project boilerplate. You can also just copy from the `watney-app-example-ts` repo.

Next, create an `app.ts` file that exports your constructed app:

```js
import { WatneyApp } from 'watney-app';

export default new WatneyApp({});
```

By putting this into its own module, we've made our app configuration portable, making it usable by other parts of the system, such as the CLI (more on that later).

Finally, create a `server.ts` file, which will be the module responsible for starting up the app:

```js
import app from './app';

app.start();
```

Before we start up the app we need to do one more thing: wire up the TypeScript build. In your `package.json`, add the necessary `scripts`:

```json
{
  "build": "npm run clean && tsc",
  "clean": "rm -rf dist",
  "start": "npm run build && node dist/server.js"
}
```

Note that this assumes you've set your `outDir` to `"dist"` in your `tsconfig.json`.

Now we can run our new Watney app!

```console
$ npm start

> watney-app-example-ts@1.0.0 start /home/chris/Code/watney-app-example-ts
> npm run build && node dist/server.js


> watney-app-example-ts@1.0.0 build /home/chris/Code/watney-app-example-ts
> npm run clean && tsc


> watney-app-example-ts@1.0.0 clean /home/chris/Code/watney-app-example-ts
> rm -rf dist

WARNING: No configurations found in configuration directory:/home/chris/Code/watney-app-example-ts/config
WARNING: To disable this warning set SUPPRESS_NO_CONFIG_WARNING in the environment.
[watney-app] It's good to be home.
[watney-app] Starting up!
[watney-app] No plugins configured.
[watney-app] No scripts configured. Exiting.
```

Note: To remove the warnings, create a [node-config configuration file](https://github.com/lorenwest/node-config/wiki/Configuration-Files) with some arbitrary content (e.g., a `./config/local.yaml` containing `test: true`)

Not a whole lot going on yet. Let's add some of our own code!

Scripts
-------

Watney scripts are the pieces of automation that you design and write for your own home. They are implemented as classes that extend `WatneyScriptBase`:

```js
import { WatneyScriptBase } from 'watney-app';

export default class ExampleScript extends WatneyScriptBase {
  public static get id() {
    return 'example-script';
  }

  public async run() {
    this.logger.log('Our script is running. How cool!');
  }
}
```

The `id` property is used in logging and other places where we might need a unique name for the script.

The `run()` method is executed when the app is started, and is not awaited. It is passed the fully-initialized app.

We register scripts in the app by passing them to the `WatneyApp` constructor:

```js
import { WatneyApp } from 'watney-app';
import ExampleScript from './scripts/example';

export default new WatneyApp({
  scripts: [ExampleScript]
});

```

Now when we start up the app, the script is run after the plugins have been initialized:

```console
$ npm start

> watney-app-example-ts@1.0.0 start /home/chris/Code/watney-app-example-ts
> npm run build && node dist/server.js


> watney-app-example-ts@1.0.0 build /home/chris/Code/watney-app-example-ts
> npm run clean && tsc


> watney-app-example-ts@1.0.0 clean /home/chris/Code/watney-app-example-ts
> rm -rf dist

[watney-app] It's good to be home.
[watney-app] Starting up!
[watney-app] No plugins configured.
[watney-app] Running scripts.
[example-script] Our script is running. How cool!
```

Plugins
-------

Watney plugins provide APIs for the various devices and services that comprise your automated home.

### Installing Plugins

Plugins can be installed via npm. For example, [`watney-plugin-example`](https://www.npmjs.com/package/watney-plugin-example):

```console
npm install watney-plugin-example
```

Once a plugin has been installed, it must then be registered in the app by adding it to the `plugins` array when constructing:

```js
const { WatneyApp } = require('watney-app');

module.exports = new WatneyApp({
  plugins: [
    require('watney-plugin-example')
  ]
});
```

