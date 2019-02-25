// tslint:disable:max-classes-per-file
import { LevelDbProvider } from './database-providers/LevelDbProvider';
import { Logger } from './Logger';
import { PluginCommandLineInterface } from './PluginCommandLineInterface';
import { PluginConfig } from './PluginConfig';
import { WatneyPluginBase } from './WatneyPluginBase';

jest.mock('./database-providers/LevelDbProvider');
jest.mock('./Logger');

let plugin: WatneyPluginBase;

class PluginImpl extends WatneyPluginBase {
  public static id: string = 'plugin-impl';
  public readonly cli = new PluginCommandLineInterface();

  constructor(config?: PluginConfig) {
    super(config);
  }

  public async init() {
    return;
  }
}

describe('when constructing the plugin', () => {
  it('should save the config', () => {
    const expectedConfig = {};

    class TestPlugin extends PluginImpl {
      get configValue() {
        return this.config;
      }
    }

    plugin = new TestPlugin(expectedConfig);

    expect((plugin as TestPlugin).configValue).toBe(expectedConfig);
  });

  describe('a LevelDB database', () => {
    class TestPlugin extends PluginImpl {
      get dbValue() {
        return this.db;
      }
    }

    it('should be set up for the plugin', () => {
      plugin = new TestPlugin();

      expect((plugin as TestPlugin).dbValue).toBeInstanceOf(LevelDbProvider);
    });

    it('should be constructed with the plugin ID', () => {
      plugin = new TestPlugin();

      expect(LevelDbProvider).toHaveBeenCalledWith(TestPlugin.id);
    });
  });

  describe('a logger', () => {
    class TestPlugin extends PluginImpl {
      get loggerValue() {
        return this.logger;
      }
    }

    it('should be set up for the plugin', () => {
      plugin = new TestPlugin();

      expect((plugin as TestPlugin).loggerValue).toBeInstanceOf(Logger);
    });

    it('should be constructed with the plugin ID', () => {
      plugin = new TestPlugin();

      expect(Logger).toHaveBeenCalledWith(TestPlugin.id);
    });
  });
});
