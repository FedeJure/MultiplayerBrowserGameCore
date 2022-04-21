import { Observable, Subject } from "rxjs";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientConnection } from "../clientConnection";
import { IPlayerView } from "../playerView";
import { Player } from "./player";
import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";

export class ServerPlayer extends Player {
  private _onStateChange: Subject<PlayerState> = new Subject();
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: IPlayerView,
    private _connection: ClientConnection,
    private playerInfoRepository: PlayerInfoRepository,
    private playerStateRepository: PlayerStateRepository
  ) {
    super(info, state, view);
  }
  updateInfo(newInfo: Omit<Partial<PlayerInfo>, "id">): void {
    super.updateInfo(newInfo);
    this.playerInfoRepository.update(this.info.id, newInfo);
  }

  updateState(newState: Partial<PlayerState>): void {
    super.updateState(newState);
    this.playerStateRepository.update(this.info.id, newState);
  }

  destroy(): void {
    super.destroy();
    this._onStateChange.complete();
  }

  get onStateChange(): Observable<PlayerState> {
    return this._onStateChange;
  }

  get connection(): ClientConnection {
    return this._connection;
  }
}
