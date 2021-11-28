export class PlayerBodyRepository {

    private playerBody: Map<string, string> = new Map()
    private bodyPlayer: Map<string, string> = new Map()

    constructor() {

    }

    public getPlayerIdFromBodyId(bodyId: string) {
        return this.bodyPlayer.get(bodyId)
    }

    public getBodyIdFromPlayerId(playerId: string) {
        return this.playerBody.get(playerId);
    }
}