import { Observable } from "rxjs";
import { Player } from "./player";
import { PlayerInfo } from "./playerInfo";
import { ServerPlayer } from "./serverPlayer";

export interface InGamePlayersRepository<T extends Player | ServerPlayer> {
    get(id: PlayerInfo['id']): T | undefined
    save(player: T)
    remove(id: PlayerInfo['id'])
    getAll(): Map<PlayerInfo['id'], T>
    onNewPlayer: Observable<T>
}