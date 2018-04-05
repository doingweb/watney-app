const Logger = require('../../lib/Logger');

let logger;

beforeAll(() => {
  console.log = jest.fn();
});

beforeEach(() => {
  logger = new Logger('expected source');
});

afterEach(() => {
  console.log.mockReset();
});

describe('when constructing', () => {
  it('should set the source name', () => {
    expect(logger.sourceName).toBe('expected source');
  });
});

it('should log messages prefixed with the source name', () => {
  logger.log('test message');

  expect(console.log).toHaveBeenCalledWith('[expected source]', 'test message');
});
