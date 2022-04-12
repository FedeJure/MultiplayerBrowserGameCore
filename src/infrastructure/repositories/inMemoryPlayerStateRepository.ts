import { Observable, Subject } from "rxjs";
import { PlayerState } from "../../domain/player/playerState";
import { PlayerStateRepository } from "./playerStateRepository";

export class InMemoryPlayerStateRepository implements PlayerStateRepository {
  private readonly _onPlayerStateChange: Subject<{
    playerId: string;
    state: PlayerState;
  }> = new Subject();
  public get onPlayerStateChange(): Observable<{
    playerId: string;
    state: PlayerState;
  }> {
    return this._onPlayerStateChange;
  }
  store: { [key: string]: PlayerState } = {};

  getPlayerState(id: string): PlayerState | undefined {
    return this.store[id];
  }

  setPlayerState(id: string, state: PlayerState): void {
    this.store[id] = state;
    this._onPlayerStateChange.next({ playerId: id, state });
  }

  getAll(): { [key: string]: PlayerState } {
    return this.store;
  }

  updateStateOf(id: string, newValues: Partial<PlayerState>) {
    const state = this.getPlayerState(id);
    if (!state) return;
    this.setPlayerState(id, { ...state, ...newValues });
  }
}
