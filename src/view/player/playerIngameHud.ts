import { BodyType } from "matter";
import { GameObjects } from "phaser";
import { FontSize, FONT_RESOLUTION } from "../Fonts";
import { GameScene } from "../scenes/GameScene";
import { LifeBar } from "./lifeBar";
export class PlayerIngameHud extends GameObjects.Container {
  private nameText: GameObjects.Text;
  public readonly matterBody: BodyType;
  p = 100
  constructor(scene: GameScene, height: number, width: number) {
    super(scene, 0, 0);
    this.setSize(width, height);
    this.nameText = scene.add.text(0, 0, "Federico Jure", {
      resolution: FONT_RESOLUTION,
    });

    this.nameText
      .setFontSize(FontSize.SMALL)
      .setFontStyle('bold')
      .setOrigin(0.5, 4)

    const lifeBar = new LifeBar(this.scene,0,-width * 1.1, width * 1.5)
    this.add([this.nameText, lifeBar]);

    scene.add.existing(this);
  }

  setDisplayName(name: string) {
    this.nameText.setText(name);
  }
}
