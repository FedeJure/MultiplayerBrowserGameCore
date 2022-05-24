import { GameObjects, Scene } from "phaser";
import { FontSize, FONT_RESOLUTION } from "../Fonts";
import { LifeBar } from "../player/lifeBar";
export class EntityIngameHud extends GameObjects.Container {
  private nameText: GameObjects.Text;
  private lifeBar: LifeBar;
  constructor(scene: Scene, height: number, width: number) {
    super(scene, 0, 0);
    this.setSize(width, height);
    this.nameText = scene.add.text(0, 0, "Federico Jure", {
      resolution: FONT_RESOLUTION,
    });

    this.nameText
      .setFontSize(FontSize.SMALL)
      .setFontStyle("bold")
      .setOrigin(0.5, 4);

    this.lifeBar = new LifeBar(this.scene, 0, -width * 1.1, width * 1.5);
    this.add([this.nameText, this.lifeBar]);

    scene.add.existing(this);
  }

  setDisplayName(name: string) {
    this.nameText.setText(name);
  }

  setLifePercent(percent: number) {
    this.lifeBar.setPercent(percent);
  }
}
