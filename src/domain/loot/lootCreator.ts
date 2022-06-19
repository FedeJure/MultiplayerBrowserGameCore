import { Loot } from "./loot";

export interface LootCreator {
    createLoot(loot: Loot)
    destroyLoot(id: Loot['id'])
}