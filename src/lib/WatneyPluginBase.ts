import { EventEmitter } from 'events';
import * as Loki from 'lokijs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { promisify } from 'util';
import { Logger } from './Logger';
import { PluginCommandLineInterface } from './PluginCommandLineInterface';
import { PluginConfig } from './PluginConfig';
import { WatneyPlugin } from './WatneyPlugin';

const pmkdirp = promisify(mkdirp);

export abstract class WatneyPluginBase extends EventEmitter
  implements WatneyPlugin {
  public abstract get cli(): PluginCommandLineInterface;
  protected static id: string;
  protected readonly config: PluginConfig;
  protected readonly logger: Logger;
  private lokiDb: Loki | undefined;

  constructor(config: PluginConfig = {}) {
    super();

    this.config = config;
    this.logger = new Logger((this.constructor as any).id);
  }

  // TODO: Use PluginDatabase instead!
  protected get db() {
    // Getters cannot be async, so we need to return a promise instead.
    return (async () => {
      if (this.lokiDb) {
        return this.lokiDb;
      }

      const dbPath = path.join(
        process.cwd(),
        '.plugin-db',
        `${(this.constructor as any).id}.db`
      );

      await pmkdirp(path.dirname(dbPath));

      await new Promise(resolve => {
        this.lokiDb = new Loki(dbPath, {
          autoload: true,
          autoloadCallback: resolve,
          autosave: true
        });
      });

      return this.lokiDb;
    })();
  }

  public async init() {
    this.logger.log('Plugin initialized.');
  }
}
