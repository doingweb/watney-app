import * as level from 'level';
import { LevelDbProvider } from './LevelDbProvider';

let db: LevelDbProvider;

beforeEach(() => {
  ((level as unknown) as jest.Mock).mockClear();
});

describe('when constructing', () => {
  beforeEach(() => {
    jest.spyOn(process, 'cwd').mockImplementation(() => 'expected-cwd');
  });

  afterEach(() => {
    (process.cwd as jest.Mock).mockRestore();
  });

  it('should create a LevelDB database for the plugin', () => {
    db = new LevelDbProvider('expected-plugin-id');

    expect(level).toHaveBeenCalledWith(
      expect.stringMatching(
        /^expected-cwd(\/|\\)\.databases(\/|\\)expected-plugin-id\.leveldb$/
      )
    );
  });
});

it('should pass set calls to LevelDB', async () => {
  db = new LevelDbProvider('plugin-id');
  await db.set('expected-key', 'expected-value');

  expect((level as any).mockPut).toHaveBeenCalledWith(
    'expected-key',
    'expected-value'
  );
});

it('should pass get calls to LevelDB', async () => {
  db = new LevelDbProvider('plugin-id');
  await db.get('expected-key');

  expect((level as any).mockGet).toHaveBeenCalledWith('expected-key');
});

it('should pass delete calls to LevelDB', async () => {
  db = new LevelDbProvider('plugin-id');
  await db.delete('expected-key');

  expect((level as any).mockDel).toHaveBeenCalledWith('expected-key');
});
