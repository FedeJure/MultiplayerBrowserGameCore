export declare class PlayerInputRequestRepository {
    private readonly store;
    set(playerId: string, request: number): void;
    remove(playerId: string): void;
    getOrCreate(playerId: string): number;
}
