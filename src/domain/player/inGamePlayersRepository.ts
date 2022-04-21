import { Player } from "./player";
import { PlayerInfo } from "./playerInfo";

export interface InGamePlayersRepository {
    get(id: PlayerInfo['id']): Player | undefined
    save(player: Player)
    remove(id: PlayerInfo['id'])
    getAll(): Map<PlayerInfo['id'], Player>
}