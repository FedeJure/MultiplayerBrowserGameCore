import { Entity } from "../entity/entity";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class Enemy extends Entity {
  constructor(
    state: EnemyState,
    info: EnemyInfo,
    view: EnemyView,
    stats: EnemyStats
  ) {
    super(info, state, view, stats);
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
  }

  get state() {
    return this._state as EnemyState;
  }

  get stats() {
    return this._stats as EnemyStats;
  }
}
