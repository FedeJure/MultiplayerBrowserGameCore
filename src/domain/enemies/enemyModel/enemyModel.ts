import { EnemyInfo } from "../EnemyInfo";
import { EnemyStats } from "../EnemyStats";

export interface EnemyModel {
    stats: EnemyStats,
    info: EnemyInfo,
    width: number,
    height: number
}