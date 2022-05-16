import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export interface Enemy {
  readonly state: EnemyState;
  readonly info: EnemyInfo;
  readonly stats: EnemyStats;
  readonly view: EnemyView;
  update(time: number, delta: number);
  updateState(state: Partial<EnemyState>);
  destroy();
}
