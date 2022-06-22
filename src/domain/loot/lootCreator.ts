import { Loot } from "./loot";

export interface LootCreator {
    createOrUpdateLoot(loot: Loot)
    destroyLoot(id: Loot['id'])
}