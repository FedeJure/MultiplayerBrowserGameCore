import { BodyType } from "matter";
import { GameObjects } from "phaser";
import { GameScene } from "./scenes/GameScene";

export class PlayerIngameHud extends GameObjects.Container {
  private nameText: GameObjects.Text;
  public readonly matterBody : BodyType
  constructor(scene: GameScene, height: number, width: number) {
    super(scene, 0, 0);
    this.setSize(width, height)
    this.nameText = scene.add.text(0,0, "Federico Jure", {
      fontSize: "2",
      resolution: 20,
    });

    this.nameText.setPosition(- this.nameText.displayWidth / 2, -height - 10)
    this.add([this.nameText])

    scene.add.existing(this)
  }

  setDisplayName(name: string) {
    this.nameText.setText(name)
  }
  
}
