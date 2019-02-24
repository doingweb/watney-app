// tslint:disable:max-classes-per-file
import { Logger } from './Logger';
import { WatneyScriptBase } from './WatneyScriptBase';

jest.mock('./Logger');

beforeEach(() => {
  (Logger as jest.Mock).mockClear();
});

class ScriptImpl extends WatneyScriptBase {
  constructor() {
    super();
  }

  public async run() {
    return;
  }
}

it('should construct the logger with the script ID', () => {
  const expectedScriptId = 'test-script';

  class TestScriptImpl extends ScriptImpl {
    public static readonly id = expectedScriptId;
  }

  // tslint:disable-next-line:no-unused-expression
  new TestScriptImpl();

  expect(Logger).toHaveBeenCalledWith(expectedScriptId);
});
