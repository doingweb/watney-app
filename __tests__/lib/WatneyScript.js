const Logger = require('../../lib/Logger');
const WatneyScript = require('../../lib/WatneyScript');

it('should have a static ID of "unknown-script"', () => {
  expect(WatneyScript.id).toBe('unknown-script');
});

describe('when constructing', () => {
  let script;

  beforeEach(() => {
    script = new WatneyScript();
  });

  it('should create a logger', () => {
    expect(script.logger).toBeInstanceOf(Logger);
  });

  it('should set the logger source to the plugin ID', () => {
    expect(script.logger.sourceName).toBe(WatneyScript.id);
  });
});
