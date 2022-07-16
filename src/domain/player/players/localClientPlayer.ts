import { EntityMovement } from "../../entity/entityMovement";
import { MapManager } from "../../environment/mapManager";
import { Balance } from "../../inventory/balance";
import { ClientInventory } from "../../inventory/playerInventory";
import { LocalPlayerView } from "../localPlayerView";
import { PlayerInfo } from "../playerInfo";
import { ClientPlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";
import { ControllablePlayer } from "./controllablePlayer";

export class LocalClientPlayer extends ControllablePlayer {
  constructor(
    info: PlayerInfo,
    state: PlayerState,
    view: LocalPlayerView,
    stats: PlayerStats,
    movementSystem: EntityMovement,
    input: ClientPlayerInput,
    inventory: ClientInventory,
    mapManager: MapManager,
    balance: Balance
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
  }

  get input(): ClientPlayerInput {
    return this._input as ClientPlayerInput;
  }

  get inventory() {
    return this._inventory as ClientInventory;
  }

  get state(): PlayerState {
    return this._state as PlayerState;
  }

  get prevState(): PlayerState {
    return this._prevState as PlayerState;
  }

  get view(): LocalPlayerView {
    return this._view as LocalPlayerView;
  }

  updateState(newState: Partial<PlayerState>): void {
    super.updateState(newState);
    if (this.prevState.isAlive && !this.state.isAlive) {
      this.view.die();
    }
    if (!this.prevState.transporting && this.state.transporting) {
      this.view.startTransporting();
    }
    if (this.prevState.transporting && !this.state.transporting) {
      this.view.stopTransporting();
    }
  }

  update(time: number, delta: number): void {
    if (this.state.transporting) return;
    super.update(time, delta);
  }

  postUpdate(): void {
    this.updateState({
      position: this.view.positionVector,
      velocity: this.view.velocity,
      side: this.view.side,
      grounded: this.view.grounded,
      inLadder: this.view.inLadder,
    });
    super.postUpdate();
  }
}
