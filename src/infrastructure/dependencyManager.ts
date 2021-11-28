export class DependencyManager {
  private static _map = new Map<string, Object>();

  public static GetOrInstantiate<Type>(instantiator: () => Type): Type {
    const key = (arguments[0] as () => Type).toString();
    if (this._map.has(key)) return this._map.get(key) as Type;
    const instance = instantiator();
    this._map.set(key, instance);
    return instance;
  }
}
