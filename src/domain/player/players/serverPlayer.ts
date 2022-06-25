import { Observable, Subject } from "rxjs";
import { PlayerStateRepository } from "../../../infrastructure/repositories/playerStateRepository";
import { ClientConnection } from "../../clientConnection";
import { PlayerView } from "../../playerView";
import { AsyncRepository } from "../../repository";
import { ControllablePlayer } from "./controllablePlayer";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";
import { PlayerInput } from "../playerInput";
import { PlayerMovement } from "../movement/playerMovement";
import { PlayerStats } from "../playerStats";
import { MapManager } from "../../environment/mapManager";
import { Balance } from "../../inventory/balance";
import { ServerPlayerInventory } from "../../inventory/serverPlayerInventory";
import { PlayerTransportation } from "../playerTransportation";

export class ServerPlayer extends ControllablePlayer {
  private _onStateChange: Subject<{
    state: PlayerState;
    change: Partial<PlayerState>;
  }> = new Subject();
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: PlayerView,
    movementSystem: PlayerMovement,
    input: PlayerInput,
    stats: PlayerStats,
    mapManager: MapManager,
    inventory: ServerPlayerInventory,
    balance: Balance,
    private _connection: ClientConnection,
    private playerInfoRepository: AsyncRepository<PlayerInfo>,
    private playerStateRepository: PlayerStateRepository,
    private playerTransportation: PlayerTransportation
  ) {
    super(
      info,
      state,
      view,
      stats,
      movementSystem,
      input,
      mapManager,
      inventory,
      balance
    );
    playerTransportation.init(this)
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

  update(time: number, delta: number): void {
      super.update(time,delta)
      this.playerTransportation.update(time,delta)
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

  get inventory() {
     return this._inventory as ServerPlayerInventory 
  }
}
