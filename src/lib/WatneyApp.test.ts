// tslint:disable:max-classes-per-file
import * as config from 'config';
import { Logger } from './Logger';
import { PluginCommandLineInterface } from './PluginCommandLineInterface';
import { PluginConfig } from './PluginConfig';
import { WatneyApp } from './WatneyApp';
import { WatneyPlugin } from './WatneyPlugin';
import { WatneyScript } from './WatneyScript';

jest.mock('./Logger');

let app: WatneyApp;

beforeEach(() => {
  ((config as unknown) as Map<any, any>).clear();
});

describe('when constructing', () => {
  it('should create a logger for "watney-app"', () => {
    app = new WatneyApp({});

    expect(Logger).toHaveBeenCalledWith('watney-app');
  });

  describe('plugins', () => {
    class Plugin implements WatneyPlugin {
      public cli: PluginCommandLineInterface = new PluginCommandLineInterface();
      public config: PluginConfig;

      constructor(c: PluginConfig) {
        this.config = c;
      }

      public async init() {
        return;
      }
    }

    class Plugin1 extends Plugin {
      public static readonly id = 'plugin-1';
    }

    class Plugin2 extends Plugin {
      public static readonly id = 'plugin-2';
    }

    beforeEach(() => {
      ((config as unknown) as Map<string, string>).set('plugin-1', 'config-1');
      ((config as unknown) as Map<string, string>).set('plugin-2', 'config-2');

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

      expect((plugin1 as Plugin1).config).toBe('config-1');
      expect((plugin2 as Plugin2).config).toBe('config-2');
    });
  });

  describe('scripts', () => {
    class Script implements WatneyScript {
      public async run() {
        return;
      }
    }

    class Script1 extends Script {
      public static readonly id = 'script-1';
    }

    class Script2 extends Script {
      public static readonly id = 'script-2';
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

    class Plugin implements WatneyPlugin {
      public cli: PluginCommandLineInterface = new PluginCommandLineInterface();

      public async init() {
        await new Promise(resolve => setTimeout(resolve));
        pluginsInitialized++;
      }
    }
    class Plugin1 extends Plugin {
      public static readonly id = '1';
    }
    class Plugin2 extends Plugin {
      public static readonly id = '2';
    }

    class Script implements WatneyScript {
      public static readonly id = 'id';

      public async run() {
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
    const mockRun = jest.fn();
    class Script implements WatneyScript {
      public static readonly id: string = 'id';
      public run = mockRun;
    }

    app = new WatneyApp({ scripts: [Script] });

    await app.start();

    expect(mockRun).toHaveBeenCalledWith(app);
  });
});
