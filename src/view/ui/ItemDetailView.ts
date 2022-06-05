import { GameObjects, Scene } from "phaser";
import { FontSize } from "../Fonts";
import { UiItem } from "./UiItem";

export class ItemDetailView extends GameObjects.Container {
  private static WIDTH: number = 100;
  private static HEIGHT: number = 100;

  private nameText: GameObjects.Text;
  private detailText: GameObjects.Text;
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
    this.nameText = scene.add
      .text(0, 0, "Default Text")
      .setPosition(0, -ItemDetailView.HEIGHT)
      .setResolution(3)
      .setFontStyle("bold")
      .setFontSize(FontSize.MEDIUM);
    this.detailText = scene.add
      .text(0, 0, "Default Text")
      .setPosition(0, -ItemDetailView.HEIGHT + this.nameText.height)
      .setResolution(3)
      .setFontStyle("bold")
      .setFontSize(FontSize.MEDIUM_SMALL);
    this.add(this.nameText);
    this.add(this.detailText);
  }

  setObject(item: UiItem) {
    this.nameText.setText(item.name).setOrigin(0.25, 0);
    this.detailText
      .setText(item.detail)
      .setOrigin(0.25, 0)
      .setWordWrapWidth(this.nameText.displayWidth);
    this.background.setDisplaySize(
      this.nameText.displayWidth + 10,
      ItemDetailView.HEIGHT
    );
  }
}
