import { PlayerState } from "../../domain/player/playerState";
import { PlayerStateRepository } from "./playerStateRepository";

export class InMemoryPlayerStateRepository implements PlayerStateRepository {
  store: {[key: string]: PlayerState} = {};

  getPlayerState(id: string): PlayerState | undefined {
    return this.store[id]
  }

  setPlayerState(id: string, state: PlayerState): void {
    this.store[id] = state
  }

  getAll(): {[key: string]: PlayerState} {
    return this.store
  }
}
