// tslint:disable:no-console

import { Logger } from './Logger';

let logger: Logger;
let mockLog: jest.Mock;

beforeAll(() => {
  mockLog = jest.fn();
  console.log = mockLog;
});

beforeEach(() => {
  logger = new Logger('expected source');
});

afterEach(() => {
  mockLog.mockReset();
});

it('should log messages prefixed with the source name', () => {
  logger.log('test message');

  expect(mockLog).toHaveBeenCalledWith('[expected source]', 'test message');
});
