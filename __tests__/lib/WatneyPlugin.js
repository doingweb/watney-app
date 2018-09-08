const { EventEmitter } = require('events');
const path = require('path');

const Logger = require('../../lib/Logger');
const WatneyPlugin = require('../../lib/WatneyPlugin');

const Loki = require('lokijs');
const mkdirp = require('mkdirp');

beforeEach(() => {
  Loki.mockClear();
  mkdirp.mockClear();
});

it('should have a static ID of "unknown-plugin"', () => {
  expect(WatneyPlugin.id).toBe('unknown-plugin');
});

it('should have a CLI function', () => {
  expect(typeof WatneyPlugin.cli).toBe('function');
});

describe('when constructing', () => {
  let plugin;
  const config = {};

  beforeEach(() => {
    plugin = new WatneyPlugin(config);
  });

  it('should be an EventEmitter', () => {
    expect(plugin).toBeInstanceOf(EventEmitter);
  });

  it('should save the config', () => {
    expect(plugin.config).toBe(config);
  });

  it('should create a logger', () => {
    expect(plugin.logger).toBeInstanceOf(Logger);
  });

  it('should set the logger source to the plugin ID', () => {
    expect(plugin.logger.sourceName).toBe(WatneyPlugin.id);
  });

  it('should create an empty config if none was passed', () => {
    plugin = new WatneyPlugin();

    expect(plugin.config).toBeInstanceOf(Object);
  });
});

describe('database getter', () => {
  let plugin;

  beforeEach(() => {
    plugin = new WatneyPlugin();
  });

  it('should ensure the database directory has been created', async () => {
    process.cwd = jest.fn(() => 'expected-cwd');

    await plugin.db;

    expect(mkdirp.mock.calls).toHaveLength(1);
    expect(mkdirp.mock.calls[0][0]).toBe(`expected-cwd${path.sep}.plugin-db`);
  });

  it('should create/load the database with the correct path and settings', async () => {
    process.cwd = jest.fn(() => 'expected-cwd');

    const result = await plugin.db;

    expect(result).toBeInstanceOf(Loki);
    expect(Loki.mock.calls[0][0]).toBe(
      `expected-cwd${path.sep}.plugin-db${path.sep}unknown-plugin.db`
    );
    expect(Loki.mock.calls[0][1].autoload).toBe(true);
    expect(Loki.mock.calls[0][1].autosave).toBe(true);
  });

  it('should memoize the database', async () => {
    await plugin.db;
    await plugin.db;

    expect(Loki.mock.calls).toHaveLength(1);
  });
});
