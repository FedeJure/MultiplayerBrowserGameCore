import { PlayerState } from "../../domain/player/playerState";
export interface PlayerStateRepository {
    getPlayerState(id: string): PlayerState | undefined;
    setPlayerState(id: string, state: PlayerState): void;
    getAll(): {
        [key: string]: PlayerState;
    };
}
