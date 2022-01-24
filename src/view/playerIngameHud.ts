import { BodyType } from "matter";
import { GameObjects } from "phaser";
import { GameScene } from "./scenes/GameScene";

export class PlayerIngameHud extends GameObjects.Container {
  private nameText: GameObjects.Text;
  public readonly matterBody : BodyType
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y);
    this.setDepth(10);
    this.nameText = scene.add.text(0, 0, "Karim", {
      fontSize: "2",
      resolution: 20,
    });
    console.log(this.nameText)
    this.nameText.displayOriginY = 1;
    this.add(this.nameText);
    // this.matterBody = scene.matter.add.gameObject(this, {
    //     ignoreGravity: true,
    //     isSensor: true,
    //   }).body as BodyType;
    this.matterBody = scene.matter.body.create({
        ignoreGravity: true,
        isSensor: true,
        ignorePointer: true,
        
    })

    console.log(scene.matter.add.gameObject(this.nameText).body as BodyType)
    console.log(this.matterBody)
    scene.add.existing(this)
  }
  
}
