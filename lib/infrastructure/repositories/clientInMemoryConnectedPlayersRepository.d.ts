import { Player } from "../../domain/player/player";
export declare class ConnectedPlayersRepository {
    private players;
    savePlayer(playerId: string, player: Player): void;
    removePlayer(playerId: string): void;
    getPlayer(playerId: string): Player | undefined;
}
