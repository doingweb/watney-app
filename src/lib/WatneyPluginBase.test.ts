// tslint:disable:max-classes-per-file
import * as Loki from 'lokijs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { Logger } from './Logger';
import { PluginCommandLineInterface } from './PluginCommandLineInterface';
import { PluginConfig } from './PluginConfig';
import { WatneyPluginBase } from './WatneyPluginBase';

jest.mock('./Logger');

beforeEach(() => {
  ((Loki as unknown) as jest.Mock).mockClear();
  ((mkdirp as unknown) as jest.Mock).mockClear();
});

class PluginImpl extends WatneyPluginBase {
  protected static id: string = 'plugin-impl';
  public readonly cli = new PluginCommandLineInterface();

  constructor(config?: PluginConfig) {
    super(config);
  }
}

describe('when constructing', () => {
  it('should save the config', () => {
    const expectedConfig = {};

    class TestPlugin extends PluginImpl {
      get configValue() {
        return this.config;
      }
    }

    const plugin = new TestPlugin(expectedConfig);

    expect(plugin.configValue).toBe(expectedConfig);
  });

  it('should construct the logger with the plugin ID', () => {
    // tslint:disable-next-line:no-unused-expression
    new PluginImpl();

    expect(Logger).toHaveBeenCalledWith('plugin-impl');
  });
});

describe('database getter', () => {
  class TestPlugin extends PluginImpl {
    get dbValue() {
      return this.db;
    }
  }

  let plugin: TestPlugin;

  beforeEach(() => {
    plugin = new TestPlugin();
  });

  it('should ensure the database directory has been created', async () => {
    process.cwd = jest.fn(() => 'expected-cwd');

    await plugin.dbValue;

    expect(((mkdirp as unknown) as jest.Mock).mock.calls).toHaveLength(1);
    expect(((mkdirp as unknown) as jest.Mock).mock.calls[0][0]).toBe(
      `expected-cwd${path.sep}.plugin-db`
    );
  });

  it('should create/load the database with the correct path and settings', async () => {
    process.cwd = jest.fn(() => 'expected-cwd');

    const result = await plugin.dbValue;

    expect(result).toBeInstanceOf(Loki);
    expect(((Loki as unknown) as jest.Mock).mock.calls[0][0]).toBe(
      `expected-cwd${path.sep}.plugin-db${path.sep}plugin-impl.db`
    );
    expect(((Loki as unknown) as jest.Mock).mock.calls[0][1].autoload).toBe(
      true
    );
    expect(((Loki as unknown) as jest.Mock).mock.calls[0][1].autosave).toBe(
      true
    );
  });

  it('should memoize the database', async () => {
    await plugin.dbValue;
    await plugin.dbValue;

    expect(((Loki as unknown) as jest.Mock).mock.calls).toHaveLength(1);
  });
});
