import { Scene } from "phaser";
import { Loot } from "../../domain/loot/loot";
import { LootGeneratorView } from "../../domain/loot/lootGeneratorView";
import { LootView } from "../../domain/loot/lootView";
import { PhaserLootView } from "./PhaserLootView";

export class PhaserLootGeneratorView implements LootGeneratorView {
    constructor(private scene: Scene) {

    }
    createLoot(loot: Loot): LootView {
        return new PhaserLootView(this.scene, loot)
    }
}