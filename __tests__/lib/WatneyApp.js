const Logger = require('../../lib/Logger');

let mockConfig, WatneyApp, app;

beforeAll(() => {
  mockConfig = new Map();
  jest.mock('config', () => mockConfig);

  WatneyApp = require('../../lib/WatneyApp');
});

afterEach(() => {
  mockConfig.clear();
});

describe('when constructing', () => {
  it('should create a logger', () => {
    app = new WatneyApp();

    expect(app.logger).toBeInstanceOf(Logger);
  });

  it('should set the logger source to "watney-app"', () => {
    app = new WatneyApp();

    expect(app.logger.sourceName).toBe('watney-app');
  });

  it('should use the config from the config package', () => {
    app = new WatneyApp();

    expect(app.config).toBe(mockConfig);
  });

  describe('plugins', () => {
    class Plugin {
      constructor(config) {
        this.config = config;
      }
    }

    class Plugin1 extends Plugin {
      static get id() {
        return 'plugin-1';
      }
    }

    class Plugin2 extends Plugin {
      static get id() {
        return 'plugin-2';
      }
    }

    beforeEach(() => {
      mockConfig.set('plugin-1', 'config-1');
      mockConfig.set('plugin-2', 'config-2');

      app = new WatneyApp({ plugins: [Plugin1, Plugin2] });
    });

    it('should use the plugin IDs as keys', () => {
      const keys = Array.from(app.plugins.keys());

      expect(keys).toEqual(['plugin-1', 'plugin-2']);
    });

    it('should construct the plugins', () => {
      const [plugin1, plugin2] = Array.from(app.plugins.values());

      expect(plugin1).toBeInstanceOf(Plugin1);
      expect(plugin2).toBeInstanceOf(Plugin2);
    });

    it('should construct the plugins with the corresponding configs', () => {
      const [plugin1, plugin2] = Array.from(app.plugins.values());

      expect(plugin1.config).toBe('config-1');
      expect(plugin2.config).toBe('config-2');
    });
  });

  describe('scripts', () => {
    class Script1 {
      static get id() {
        return 'script-1';
      }
    }

    class Script2 {
      static get id() {
        return 'script-2';
      }
    }

    beforeEach(() => {
      app = new WatneyApp({ scripts: [Script1, Script2] });
    });

    it('should use the script IDs as keys', () => {
      const keys = Array.from(app.scripts.keys());

      expect(keys).toEqual(['script-1', 'script-2']);
    });

    it('should construct the scripts', () => {
      const [script1, script2] = Array.from(app.scripts.values());

      expect(script1).toBeInstanceOf(Script1);
      expect(script2).toBeInstanceOf(Script2);
    });
  });
});

describe('when starting the app', () => {
  it('should initialize plugins before running scripts', async () => {
    let pluginsInitialized = 0;

    class Plugin {
      async init() {
        await new Promise(resolve => setTimeout(resolve));
        pluginsInitialized++;
      }
    }
    class Plugin1 extends Plugin {
      static get id() {
        return 1;
      }
    }
    class Plugin2 extends Plugin {
      static get id() {
        return 2;
      }
    }

    class Script {
      run() {
        if (pluginsInitialized < 2) {
          throw new Error('Plugins must be initialized first.');
        }
      }
    }
    class Script1 extends Script {}
    class Script2 extends Script {}

    app = new WatneyApp({
      plugins: [Plugin1, Plugin2],
      scripts: [Script1, Script2]
    });

    await app.start();
  });

  it('should pass the app to the scripts', async () => {
    let run = jest.fn();
    let Script = jest.fn().mockImplementation(() => ({ run }));

    app = new WatneyApp({ scripts: [Script] });

    await app.start();

    expect(run).toHaveBeenCalledWith(app);
  });
});
