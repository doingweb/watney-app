import * as config from 'config';
import { AppInitializer } from './AppInitializer';
import { Logger } from './Logger';
import { PluginConfig } from './PluginConfig';
import { WatneyPlugin } from './WatneyPlugin';
import { WatneyScript } from './WatneyScript';

export class WatneyApp {
  public plugins: Map<string, WatneyPlugin>;
  public scripts: Map<string, WatneyScript>;
  private logger: Logger;
  private config: config.IConfig;

  constructor(initializer: AppInitializer) {
    this.logger = new Logger('watney-app');

    this.logger.log("It's good to be home.");

    this.config = config;

    this.plugins = new Map();
    for (const Plugin of initializer.plugins || []) {
      const pluginConfig = this.config.has(Plugin.id)
        ? this.config.get<PluginConfig>(Plugin.id)
        : {};
      this.plugins.set(Plugin.id, new Plugin(pluginConfig));
    }

    this.scripts = new Map();
    for (const Script of initializer.scripts || []) {
      this.scripts.set(Script.id, new Script());
    }
  }

  public async start() {
    this.logger.log('Starting up!');

    if (this.plugins.size) {
      this.logger.log('Initializing plugins.');
    } else {
      this.logger.log('No plugins configured.');
    }

    const pluginsInitialized: Array<Promise<void>> = [];
    this.plugins.forEach(p => pluginsInitialized.push(p.init()));
    await Promise.all(pluginsInitialized);

    if (this.scripts.size) {
      this.logger.log('Running scripts.');
    } else {
      this.logger.log('No scripts configured. Exiting.');
    }

    this.scripts.forEach(s => s.run(this));
  }
}
