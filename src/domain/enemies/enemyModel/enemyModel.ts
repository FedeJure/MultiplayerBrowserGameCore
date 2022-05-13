import { EnemyStats } from "../EnemyStats";

export interface EnemyModel {
    stats: EnemyStats,
    name: string,
    width: number,
    height: number
}