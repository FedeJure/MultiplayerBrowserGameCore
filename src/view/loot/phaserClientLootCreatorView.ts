import { Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Loot } from "../../domain/loot/loot";
import { LootCreator } from "../../domain/loot/lootCreator";
import { PhaserClientLootView } from "./phaserClientLootView";

export class PhaserClientLootCreatorView implements LootCreator {
  private views: { [key: Loot["id"]]: PhaserClientLootView } = {};
  constructor(
    private scene: Scene,
    private collisionManager: CollisionManager
  ) {}
  createLoot(loot: Loot) {
    const view = new PhaserClientLootView(this.scene, loot);
    this.views[loot.id] = view;
    this.collisionManager.addObject(view);
  }
  destroyLoot(id: string) {
    if (this.views[id]) {
      this.views[id].destroy();
      delete this.views[id];
    }
  }
}
