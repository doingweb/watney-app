import { WatneyApp } from './WatneyApp';

export interface WatneyScript {
  run(app: WatneyApp): Promise<void>;
}
