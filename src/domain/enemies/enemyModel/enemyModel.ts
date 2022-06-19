import { LootConfiguration } from "../../loot/lootConfiguration";
import { EnemyStats } from "../EnemyStats";

export interface EnemyModel {
    stats: EnemyStats,
    name: string,
    lootConfigId: LootConfiguration['id']
}