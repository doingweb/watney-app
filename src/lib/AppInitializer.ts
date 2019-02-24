import { WatneyPluginConstructor } from './WatneyPluginConstructor';
import { WatneyScriptConstructor } from './WatneyScriptConstructor';

export interface AppInitializer {
  plugins?: WatneyPluginConstructor[];
  scripts?: WatneyScriptConstructor[];
}
