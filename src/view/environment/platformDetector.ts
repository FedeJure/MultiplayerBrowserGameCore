import { Scene } from "phaser";
import { v4 as uuidv4 } from "uuid";
import { ViewObject, ViewObjectType } from "../../domain/viewObject";

export class PlatformDetector
  extends Phaser.GameObjects.Rectangle
  implements ViewObject
{
  public static Type = "PlatformDetector";
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 30, 30);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setName('Playform detector')
    this.setData("id", uuidv4());
    this.setData("type", ViewObjectType.PlatformDetector);
  }
  get id() {
    return this.getData("id");
  }
  get viewType() {
    return this.getData("type");
  }
}
