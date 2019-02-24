import { PluginConfig } from './PluginConfig';
import { WatneyPlugin } from './WatneyPlugin';

export interface WatneyPluginConstructor {
  id: string;
  new (config: PluginConfig): WatneyPlugin;
}
