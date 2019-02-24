import { PluginCommandLineInterface } from './PluginCommandLineInterface';

/**
 * A Watney plugin
 *
 * @export
 * @interface WatneyPlugin
 */
export interface WatneyPlugin {
  /**
   * The command-line interface for the plugin
   *
   * Provides relevant information to a user and/or assists in configuration.
   *
   * @type {PluginCommandLineInterface}
   * @memberof WatneyPlugin
   */
  readonly cli: PluginCommandLineInterface;

  /**
   * Initialize the plugin
   *
   * Prepares the plugin for use by scripts. Awaited at Watney app start.
   *
   * @returns {Promise<void>}
   * @memberof WatneyPlugin
   */
  init(): Promise<void>;
}
