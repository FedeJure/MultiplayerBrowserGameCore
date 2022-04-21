import { Player } from "./player2.0";
import { PlayerInfo } from "./playerInfo";

export interface InGamePlayersRepository {
    get(id: PlayerInfo['id']): Player | undefined
    save(player: Player)
    remove(id: PlayerInfo['id'])
    getAll(): Map<PlayerInfo['id'], Player>
}