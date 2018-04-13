const { EventEmitter } = require('events');

const Logger = require('../../lib/Logger');
const WatneyPlugin = require('../../lib/WatneyPlugin');

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
});
