import { LevelDbProvider } from './database-providers/LevelDbProvider';
import { Logger } from './Logger';
import { PluginCommandLineInterface } from './PluginCommandLineInterface';
import { PluginConfig } from './PluginConfig';
import { PluginDatabase } from './PluginDatabase';
import { WatneyPlugin } from './WatneyPlugin';

export abstract class WatneyPluginBase implements WatneyPlugin {
  public abstract get cli(): PluginCommandLineInterface;
  public static id: string;
  protected readonly config: PluginConfig;
  protected readonly db: PluginDatabase;
  protected readonly logger: Logger;

  constructor(config: PluginConfig = {}) {
    const pluginId = (this.constructor as any).id;

    this.config = config;
    this.db = new LevelDbProvider(pluginId);
    this.logger = new Logger(pluginId);
  }

  public abstract init(): Promise<void>;
}
