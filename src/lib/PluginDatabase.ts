export interface PluginDatabase {
  set<T>(key: string, value: T): Promise<void>;
  get<T>(key: string): Promise<T>;
  delete(key: string): Promise<void>;
}
