import { EnemyInfo } from "../../domain/enemies/EnemyInfo";
import { EnemyState } from "../../domain/enemies/EnemyState";
import { EnemyStats } from "../../domain/enemies/EnemyStats";

export interface EnemyStatesDto {
  enemies: { state: EnemyState; info: EnemyInfo; stats: EnemyStats }[];
}
