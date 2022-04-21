import { Player2_0 } from "./player2.0";
import { PlayerInfo } from "./playerInfo";

export interface PlayersRepository2_0 {
    get(id: PlayerInfo['id']): Player2_0 | undefined
    save(player: Player2_0)
    remove(id: PlayerInfo['id'])
    getAll(): Map<PlayerInfo['id'], Player2_0>
}