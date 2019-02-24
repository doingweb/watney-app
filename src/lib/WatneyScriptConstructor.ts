import { WatneyScript } from './WatneyScript';

export interface WatneyScriptConstructor {
  id: string;
  new (): WatneyScript;
}
