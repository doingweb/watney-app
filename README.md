Watney
======

[![Build Status](https://travis-ci.org/doingweb/watney-app.svg?branch=master)](https://travis-ci.org/doingweb/watney-app)
[![Greenkeeper badge](https://badges.greenkeeper.io/doingweb/watney-app.svg)](https://greenkeeper.io/)

DIY home automation for the JavaScript enthusiast.

Getting Started
---------------

Your Watney project is like any other Node.js project. Start with an empty directory and initialize `npm`:

```console
npm init
```

Then, install `watney-app`:

```console
npm install watney-app
```

Next, create an `app.js` file that exports your constructed app:

```js
const { WatneyApp } = require('watney-app');

module.exports.default = new WatneyApp({});
```

Note that we export it as `default` so that it's compatible with ES modules.

By putting this into its own module, we've made our app configuration portable, making it usable by other parts of the system, such as the CLI (more on that later).

Now create a `server.js` file, which will be the module responsible for starting up the app:

```js
const app = require('./app');

app.start();
```

Finally, add a block to your `package.json` to hold some important metadata:

```json
{
  // [...]
  "watney": {
    "app": "dist/app.js"
  },
  // [...]
}
```

Now we can run our new Watney app!

```console
$ npm start

> watney-app-example@1.0.0 start /home/chris/Code/watney-app-example
> node server.js

WARNING: No configurations found in configuration directory:/home/chris/Code/watney-app-example/config
WARNING: To disable this warning set SUPPRESS_NO_CONFIG_WARNING in the environment.
[watney-app] It's good to be home.
[watney-app] Starting up!
[watney-app] No plugins configured.
[watney-app] No scripts configured. Exiting.
$
```

Note: To remove the warnings, create a [node-config configuration file](https://github.com/lorenwest/node-config/wiki/Configuration-Files) with some arbitrary content (e.g., a `./config/local.yaml` containing `test: true`)

Not a whole lot going on yet. Let's add some of our own code!

Scripts
-------

Watney scripts are the pieces of automation that you design and write for your own home. They are implemented as classes that extend `WatneyScriptBase`:

```js
const { WatneyScriptBase } = require('watney-app');

module.exports = class ExampleScript extends WatneyScriptBase {
  static get id() {
    return 'example-script';
  }

  async run(app) {
    this.logger.log('Our script is running. How cool!');
  }
};
```

The `id` property is used in logging and other places where we might need a unique name for the script.

The `run()` method is executed when the app is started, and is not awaited. It is passed the fully-initialized app.

We register scripts in the app by passing them to the `WatneyApp` constructor:

```js
const { WatneyApp } = require('watney-app');

module.exports = new WatneyApp({
  scripts: [
    require('./scripts/example')
  ]
});
```

Now when we start up the app, the script is run after the plugins have been initialized:

```console
$ npm start

> watney-app-example@1.0.0 start /home/chris/Code/watney-app-example
> node server.js

[watney-app] It's good to be home.
[watney-app] Starting up!
[watney-app] No plugins configured.
[watney-app] Running scripts.
[example-script] Our script is running. How cool!
$
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

### Configuring plugins

The configuration for plugins is handled by the [node-config](https://github.com/lorenwest/node-config) system. So for example, you might have a `config/local.yaml` file:

```yaml
example:
  fruit: banana
```

This configures the `example` plugin to have a setting `fruit` with value `banana`. The config object for each plugin is passed to it during object construction.

### Plugin Databases

Plugins each get their own [LevelDB](https://www.npmjs.com/package/level) database, which can be used to store important non-static information such as renewable authorization tokens. They live in the `.databases` directory (which you will need to create, currently) at the root of your Watney project.

Since plugins may store sensitive information, it is recommended that you have your source control ignore the `.databases` directory.

### Building a Plugin

See [`watney-plugin-example`](https://www.npmjs.com/package/watney-plugin-example) for example plugin code.

#### Extend `WatneyPlugin`

All Watney plugins should extend the `WatneyPlugin` class exported by [`watney-app`](https://github.com/doingweb/watney-app).

#### Override `id`

All plugins should have unique IDs that match the package name. For example, the plugin in a package called `watney-plugin-example` should have the ID `example`.

#### Override `description`

Provide a description for a plugin by overriding the `description` property.

#### Implement `init()`

The work of initializing a plugin should happen in `init()`. For example, enumerating devices or setting up event listeners. This method is awaited before scripts are run, so that scripts can access only fully-initialized plugins.

#### Provide a command-line interface

Overriding `cli` with an awaitable function will add the plugin to the app CLI's list, making it accessible from that central command.

TODO
----

- [ ] Fix [security issues](https://github.com/doingweb/watney-app/network/alerts)
- [ ] Update `README.md` and `docs/getting-started-typescript.md`.
- [ ] Should we add an `isConfigured()` method (or some other validation) on plugins, to signal whether or not it has been configured correctly?
- [ ] TODOs → tickets
- [ ] Automatically create the `.databases` directory
