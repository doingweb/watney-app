import * as level from 'level';
import * as path from 'path';
import { PluginDatabase } from '../PluginDatabase';

export class LevelDbProvider implements PluginDatabase {
  private levelDb: any;

  constructor(ownerId: string) {
    const dbPath: string = path.join(
      process.cwd(),
      '.databases',
      `${ownerId}.leveldb`
    );

    this.levelDb = level(dbPath);
  }

  public async set<T>(key: string, value: T) {
    await this.levelDb.put(key, value);
  }

  public async get<T>(key: string) {
    return (await this.levelDb.get(key)) as T;
  }

  public async delete(key: string) {
    await this.levelDb.del(key);
  }
}
