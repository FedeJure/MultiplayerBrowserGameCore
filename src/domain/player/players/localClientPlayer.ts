import { PlayerView } from "../../playerView";
import { AnimationSystem } from "../animations/animationSystem";
import { CombatSystem } from "../combat/combatSystem";
import { MovementSystem } from "../movement/movementSystem";
import { PlayerInfo } from "../playerInfo";
import { PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";
import { ClientPlayer } from "./clientPlayer";

export class LocalClientPlayer extends ClientPlayer {
  constructor(
    _info: PlayerInfo,
    _state: PlayerState,
    _view: PlayerView,
    private _stats: PlayerStats,
    private _combatSystem: CombatSystem,
    private _movementSystem: MovementSystem,
    private _animationSystem: AnimationSystem,
    private _input: PlayerInput
  ) {
    super(_info, _state, _view);
  }

  updateInfo(newInfo: Partial<PlayerInfo>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<PlayerState>) {
    this._state = { ...this.state, ...newState };
  }

  updateStats(newStats: Partial<PlayerStats>) {
    this._stats = { ...this.stats, ...newStats };
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
  get input() {
    return this._input;
  }
  get stats() {
    return this._stats;
  }

  update(time: number, delta: number) {
    this._combatSystem.processCombat(this, delta);
    this._movementSystem.processMovement(this, delta);
    this._animationSystem.processAnimation(this);
    super.update(time, delta);
  }
}
