import { Observable, Subject } from "rxjs";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientConnection } from "../clientConnection";
import { PlayerView } from "../playerView";
import { AsyncRepository } from "../repository";
import { CombatSystem } from "./combat/combatSystem";
import { ClientPlayer } from "./player";
import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";

export class ServerPlayer extends ClientPlayer {
  private _onStateChange: Subject<{
    state: PlayerState;
    change: Partial<PlayerState>;
  }> = new Subject();
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: PlayerView,
    combatSystem: CombatSystem,
    private _connection: ClientConnection,
    private playerInfoRepository: AsyncRepository<PlayerInfo>,
    private playerStateRepository: PlayerStateRepository
  ) {
    super(info, state, view, combatSystem);
  }
  updateInfo(newInfo: Omit<Partial<PlayerInfo>, "id">): void {
    super.updateInfo(newInfo);
    this.playerInfoRepository.update(this.info.id, newInfo);
  }

  updateState(newState: Partial<PlayerState>): void {
    super.updateState(newState);
    this._onStateChange.next({ state: this.state, change: newState });
    this.playerStateRepository.update(this.info.id, newState);
  }

  destroy(): void {
    super.destroy();
    this._onStateChange.complete();
  }

  get onStateChange(): Observable<{
    state: PlayerState;
    change: Partial<PlayerState>;
  }> {
    return this._onStateChange;
  }

  get connection(): ClientConnection {
    return this._connection;
  }
}
