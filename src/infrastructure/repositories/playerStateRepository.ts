import { Observable } from "rxjs";
import { PlayerState } from "../../domain/player/playerState";

export interface PlayerStateRepository {
  get(id: string): PlayerState | undefined;
  save(id: string, state: PlayerState): void;
  getAll(): { [key: string]: PlayerState };
  update(id: string, newValues: Partial<PlayerState>);
  get onPlayerStateChange(): Observable<{
    playerId: string;
    state: PlayerState;
  }>;
}
