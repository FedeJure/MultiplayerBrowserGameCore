import { Entity } from "../entity/entity";
import { EnemyAnimation } from "./EnemyAnimation";
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
    info: EnemyInfo,
    state: EnemyState,
    view: EnemyView,
    stats: EnemyStats
  ) {
    super(info, state, view, stats, undefined, undefined, new EnemyAnimation());
  }

  postUpdate() {
    this._animations.update();
  }
}
