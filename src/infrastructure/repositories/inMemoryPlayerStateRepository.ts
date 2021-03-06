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

  get(id: string): PlayerState | undefined {
    return this.store[id];
  }

  save(id: string, state: PlayerState): void {
    this.store[id] = state;
    this._onPlayerStateChange.next({ playerId: id, state });
  }

  getAll(): { [key: string]: PlayerState } {
    return this.store;
  }

  update(id: string, newValues: Partial<PlayerState>) {
    const state = this.get(id);
    if (!state) return;
    this.save(id, { ...state, ...newValues });
  }
}
