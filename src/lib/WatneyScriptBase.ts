import { Logger } from './Logger';
import { WatneyApp } from './WatneyApp';
import { WatneyScript } from './WatneyScript';
import { WatneyScriptConstructor } from './WatneyScriptConstructor';

export abstract class WatneyScriptBase implements WatneyScript {
  public static readonly id: string = 'unknown-script';
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger((this.constructor as WatneyScriptConstructor).id);
  }

  public abstract run(app: WatneyApp): Promise<void>;
}
