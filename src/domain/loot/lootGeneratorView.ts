import { Loot } from "./loot";
import { LootView } from "./lootView";

export interface LootGeneratorView {
    createLoot(loot: Loot): LootView
}