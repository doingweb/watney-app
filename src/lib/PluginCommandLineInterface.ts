// tslint:disable:no-console
export class PluginCommandLineInterface {
  private behavior: CliFunction | undefined;

  constructor(behavior?: CliFunction) {
    this.behavior = behavior;
  }

  public async run() {
    if (this.behavior) {
      await this.behavior();
    } else {
      console.log('Sorry, no CLI is defined for this plugin.');
    }
  }
}

type CliFunction = () => Promise<void>;
