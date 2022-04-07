import { GameObjects, Scene } from "phaser";
import { Item } from "../domain/items/item";

export class ItemDetailView extends GameObjects.Container {
  private static WIDTH: number = 100;
  private static HEIGHT: number = 100;

  private nameText: GameObjects.Text;
  private background: GameObjects.Rectangle;
  constructor(scene: Scene) {
    super(scene, 0, 0, []);
    this.scene.add.existing(this);

    this.background = scene.add
      .rectangle(
        0,
        0,
        ItemDetailView.WIDTH,
        ItemDetailView.HEIGHT,
        Phaser.Display.Color.HexStringToColor("938274").color,
        0.8
      )
      .setOrigin(0.25, 1);
    this.add(this.background);
    this.nameText = scene.add.text(0, 0, "").setPosition(0, -100).setResolution(3).setFontStyle("bold");
    this.add(this.nameText);
  }

  setItem(item: Item) {
    this.nameText.setText(item.name).setOrigin(0.25, 0);
    this.background.setDisplaySize(
      this.nameText.displayWidth + 10,
      ItemDetailView.HEIGHT
    );
  }
}
