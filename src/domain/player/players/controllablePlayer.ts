import { Attackable } from "../../combat/attackTarget";
import { AttackTargetType } from "../../combat/attackTargetType";
import { Entity } from "../../entity/entity";
import { MapManager } from "../../environment/mapManager";
import { PlayerView } from "../../playerView";
import { AnimationSystem } from "../animations/animationSystem";
import { DefendCombatAction } from "../combat/actions/DefendCombatAction";
import { SimpleForwardPunchCombatAction } from "../combat/actions/SimpleForwardPunchCombatAction";
import { CombatResult } from "../combat/combatResult";
import { CombatSystem } from "../combat/combatSystem";
import { MovementSystem } from "../movement/movementSystem";
import { PlayerInfo } from "../playerInfo";
import { PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export class ControllablePlayer extends Entity<
  PlayerInfo,
  PlayerState,
  PlayerView,
  PlayerStats,
  CombatSystem
> {
  protected _animationSystem: AnimationSystem;
  constructor(
    _info: PlayerInfo,
    _state: PlayerState,
    _view: PlayerView,
    _stats: PlayerStats,
    private _movementSystem: MovementSystem,
    private _input: PlayerInput,
    mapManager: MapManager //usar esto para spawnear al jugador en un spot de spawn al morir.
  ) {
    super(
      _info,
      _state,
      _view,
      _stats,
      new CombatSystem(mapManager, [
        new SimpleForwardPunchCombatAction(),
        new DefendCombatAction(),
      ])
    );
    this._animationSystem = new AnimationSystem(this);
  }
  updateStats(newStats: Partial<PlayerStats>) {
    this._stats = { ...this.stats, ...newStats };
  }

  destroy() {
    this._view.destroy();
  }

  get input() {
    return this._input;
  }
  get animSystem() {
    return this._animationSystem;
  }

  update(time: number, delta: number) {
    this.combat.update(time, delta);
    this._movementSystem.processMovement(this, time, delta);
    this._animationSystem.processAnimation(this);
    super.update(time, delta);
  }

  getAttackablesOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): Attackable[] {
    return this.view.combatCollisionResolver
      .getTargetsOnArea(x, y, width, height)
      .filter(
        (t) =>
          t.target !== this &&
          (t.type === AttackTargetType.PLAYER ||
            t.type === AttackTargetType.MOB)
      )
      .map((t) => t.target);
  }
}
