import { PlayerState } from "../../domain/player/playerState";
import { PlayerStateRepository } from "./playerStateRepository";
export declare class InMemoryPlayerStateRepository implements PlayerStateRepository {
    store: {
        [key: string]: PlayerState;
    };
    getPlayerState(id: string): PlayerState | undefined;
    setPlayerState(id: string, state: PlayerState): void;
    getAll(): {
        [key: string]: PlayerState;
    };
}
