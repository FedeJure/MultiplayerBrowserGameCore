import { LootConfiguration } from "../../loot/lootConfiguration";
import { EnemyStats } from "../EnemyStats";

export interface EnemyModel {
    id: string,
    stats: EnemyStats,
    name: string,
    lootConfigId: LootConfiguration['id']
}