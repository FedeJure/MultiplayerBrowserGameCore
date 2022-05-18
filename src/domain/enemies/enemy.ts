import { EntityAnimationCode, AnimationLayer } from "../entity/animations";
import { Entity } from "../entity/entity";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class Enemy extends Entity {
  private alive: boolean = true;

  constructor(
    state: EnemyState,
    info: EnemyInfo,
    view: EnemyView,
    stats: EnemyStats
  ) {
    super(info, state, view, stats);
  }

  destroy(): void {
    this.alive = false;
    this.view.setVelocity(0,0)
    this.view.playAnimations([
      {
        name: EntityAnimationCode.DIE,
        layer: AnimationLayer.MOVEMENT,
        duration: 1000,
      },
    ]);
    setTimeout(() => {
      super.destroy();
    }, 1000);
  }

  update(time: number, delta: number): void {
    if (this.alive) super.update(time, delta);
  }

  get state() {
    return this._state as EnemyState;
  }

  get stats() {
    return this._stats as EnemyStats;
  }
}
