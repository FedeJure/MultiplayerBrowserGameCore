import { resolveMovementAnimationForPlayer } from "../actions/resolveMovementAnimationForPlayer";
import { resolvePlayerMovementWithInput } from "../actions/resolvePlayerMovementWithInput";
import { PlayerView } from "../playerView";
import { Side } from "../side";
import { CombatSystem } from "./combat/combatSystem";
import { PlayerInfo } from "./playerInfo";
import { PlayerInput } from "./playerInput";
import { PlayerState } from "./playerState";

export class ClientPlayer {
  constructor(
    private _info: PlayerInfo,
    private _state: PlayerState,
    private _view: PlayerView,
    private _combatSystem: CombatSystem
  ) {}

  updateInfo(newInfo: Partial<PlayerInfo>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<PlayerState>) {
    this._state = { ...this.state, ...newState };
  }

  destroy() {
    this._view.destroy();
  }

  get info() {
    return this._info;
  }
  get state() {
    return this._state;
  }
  get view() {
    return this._view;
  }

  processCombat(input: PlayerInput) {
    this._combatSystem.processCombat(this, input);
  }

  processMovement(input: PlayerInput, deltaTime: number) {
    const newState = resolvePlayerMovementWithInput(
      input,
      this,
      this.state,
      deltaTime
    );
    this.view.setVelocity(newState.velocity.x, newState.velocity.y);
    this.view.lookToLeft(newState.side === Side.LEFT);
    this.updateState({
      ...newState,
      anim: resolveMovementAnimationForPlayer(newState),
    });
  }
}
