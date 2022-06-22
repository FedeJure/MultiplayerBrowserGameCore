import { GameObjects, Scene } from "phaser";
import { Loot } from "../../domain/loot/loot";
import { ViewObject, ViewObjectType } from "../../domain/viewObject";

export class PhaserClientLootView
  extends GameObjects.Image
  implements ViewObject
{
  constructor(scene: Scene, loot: Loot) {
    super(scene, loot.position.x, loot.position.y, "loot");
    this.setDisplaySize(10, 15);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setData("id", loot.id);
    this.setData("type", ViewObjectType.Loot);
    this.setData("loot", loot);
  }
  get id() {
    return this.getData("id");
  }

  get viewType() {
    return this.getData("type");
  }

  updateLoot(loot: Loot) {
    this.setData("loot", loot);
  }
}
