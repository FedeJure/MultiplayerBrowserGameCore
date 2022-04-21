import { Observable } from "rxjs";
import { ClientPlayer } from "./player";
import { PlayerInfo } from "./playerInfo";
import { ServerPlayer } from "./serverPlayer";

export interface InGamePlayersRepository<T extends ClientPlayer | ServerPlayer> {
    get(id: PlayerInfo['id']): T | undefined
    save(player: T)
    remove(id: PlayerInfo['id'])
    getAll(): Map<PlayerInfo['id'], T>
    onNewPlayer: Observable<T>
}