import { Observable, Subject } from "rxjs";
import { ClientConnection } from "../../clientConnection";
import { PlayerView } from "../../playerView";
import { AsyncRepository } from "../../repository";
import { ControllablePlayer } from "./controllablePlayer";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";
import { PlayerInput } from "../playerInput";
import { PlayerStats } from "../playerStats";
import { MapManager } from "../../environment/mapManager";
import { Balance } from "../../inventory/balance";
import { ServerPlayerInventory } from "../../inventory/serverPlayerInventory";
import { PlayerTransportation } from "../playerTransportation";
import { EntityMovement } from "../../entity/entityMovement";
import { DefaultGameConfiguration } from "../../../infrastructure/configuration/GameConfigurations";

export class ServerPlayer extends ControllablePlayer {
  private _onStateChange: Subject<{
    state: PlayerState;
    change: Partial<PlayerState>;
  }> = new Subject();
  private lastTimeSave = Date.now();
  private newStateToSave: Partial<PlayerState> = {};
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: PlayerView,
    movementSystem: EntityMovement,
    input: PlayerInput,
    stats: PlayerStats,
    mapManager: MapManager,
    inventory: ServerPlayerInventory,
    balance: Balance,
    private _connection: ClientConnection,
    private playerInfoRepository: AsyncRepository<PlayerInfo>,
    private playerStateRepository: AsyncRepository<PlayerState>,
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
    playerTransportation.init(this);
  }
  updateInfo(newInfo: Omit<Partial<PlayerInfo>, "id">): void {
    super.updateInfo(newInfo);
    this.playerInfoRepository.update(this.info.id, newInfo);
  }

  updateState(newState: Partial<PlayerState>): void {
    super.updateState(newState);
    this._onStateChange.next({ state: this.state, change: newState });
    this.newStateToSave = { ...this.newStateToSave, ...newState };
  }

  destroy(): void {
    super.destroy();
    this._onStateChange.complete();
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    this.playerTransportation.update(time, delta);
    if (
      Date.now() >
      this.lastTimeSave + DefaultGameConfiguration.playerStatesEventInterval
    ) {
      this.lastTimeSave = Date.now();
      this.playerStateRepository.update(this.info.id, this.newStateToSave);
      this.newStateToSave = {};
    }
  }

  postUpdate(): void {
    this.updateState({
      position: this.view.positionVector,
      velocity: this.view.velocity,
      side: this.view.side,
      grounded: this.view.grounded,
    });
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
    return this._inventory as ServerPlayerInventory;
  }
}
