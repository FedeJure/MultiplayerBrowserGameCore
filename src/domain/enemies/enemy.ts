import { Entity } from "../entity/entity";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class Enemy extends Entity<
  EnemyInfo,
  EnemyState,
  EnemyView,
  EnemyStats
> {
  constructor(
    state: EnemyState,
    info: EnemyInfo,
    view: EnemyView,
    stats: EnemyStats
  ) {
    super(info, state, view, stats);
  }

  destroy(): void {
    this.view.setVelocity(0, 0);
    super.destroy();
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
  }
}
