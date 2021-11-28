export declare class DependencyManager {
    private static _map;
    static GetOrInstantiate<Type>(instantiator: () => Type): Type;
}
