import { Observable } from "rxjs";
import { PlayerStateDto } from "./dtos/playerStateDTO";
export declare class ClientInMemoryConnectedPlayersRepository {
    private players;
    private _onStateChange;
    onStateChange(playerId: string): Observable<PlayerStateDto>;
    saveState(playerId: string, state: PlayerStateDto): void;
    getState(playerId: string): PlayerStateDto | undefined;
}
