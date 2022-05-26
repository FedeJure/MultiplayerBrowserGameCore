import { Attackable } from "../../combat/attackTarget";
import { AttackTargetType } from "../../combat/attackTargetType";
import { Entity } from "../../entity/entity";
import { MapManager } from "../../environment/mapManager";
import { PlayerView } from "../../playerView";
import { AnimationSystem } from "../animations/animationSystem";
import { DefendCombatAction } from "../combat/actions/DefendCombatAction";
import { SimpleForwardPunchCombatAction } from "../combat/actions/SimpleForwardPunchCombatAction";
import { CombatSystem } from "../combat/combatSystem";
import { PlayerMovement } from "../movement/playerMovement";
import { PlayerInfo } from "../playerInfo";
import { PlayerInput } from "../playerInput";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export class ControllablePlayer extends Entity<
  PlayerInfo,
  PlayerState,
  PlayerView,
  PlayerStats
> {
  protected _animationSystem: AnimationSystem;
  constructor(
    _info: PlayerInfo,
    _state: PlayerState,
    _view: PlayerView,
    _stats: PlayerStats,
    _movementSystem: PlayerMovement,
    private _input: PlayerInput,
    mapManager: MapManager //usar esto para spawnear al jugador en un spot de spawn al morir.
  ) {
    super(
      _info,
      _state,
      _view,
      _stats,
      _movementSystem,
      new CombatSystem(mapManager, [
        new SimpleForwardPunchCombatAction(),
        new DefendCombatAction(),
      ]),
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
    super.update(time, delta);
    this._animationSystem.processAnimation(this);
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
