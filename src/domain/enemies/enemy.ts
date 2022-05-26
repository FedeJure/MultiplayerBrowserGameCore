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
}
