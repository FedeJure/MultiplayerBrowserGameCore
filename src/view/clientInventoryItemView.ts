import { GameObjects, Scene } from "phaser";

export class InventoryItemView extends GameObjects.Container {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, []);
    this.add(
      scene.add
        .image(0, 0, "inventoryItemBackground")
        .setDisplaySize(InventoryItemView.SIZE, InventoryItemView.SIZE)
        .setOrigin(0,0)
    );
  }

  public static get SIZE() {
    return 50;
  }
}
