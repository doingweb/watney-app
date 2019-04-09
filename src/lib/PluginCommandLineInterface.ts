import { WatneyApp } from './WatneyApp';

// tslint:disable:no-console
export class PluginCommandLineInterface {
  private behavior: CliFunction | undefined;

  constructor(behavior?: CliFunction) {
    this.behavior = behavior;
  }

  public async run(app: WatneyApp) {
    if (this.behavior) {
      await this.behavior(app);
    } else {
      console.log('Sorry, no CLI is defined for this plugin.');
    }
  }
}

type CliFunction = (app: WatneyApp) => Promise<void>;
