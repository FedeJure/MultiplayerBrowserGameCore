export declare class PlayerBodyRepository {
    private playerBody;
    private bodyPlayer;
    constructor();
    getPlayerIdFromBodyId(bodyId: string): string | undefined;
    getBodyIdFromPlayerId(playerId: string): string | undefined;
}
