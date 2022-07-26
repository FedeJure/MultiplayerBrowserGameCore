import { Vector } from "../vector"

export interface EnemySpawnerConfig {
    enemyModelId: string,
    maxEnemies: number
    minInterval: number
    maxInterval: number,
    position: Vector,
    mapId: number
}