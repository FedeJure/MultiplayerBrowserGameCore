import { GameObjects, Scene } from "phaser";

export class MoneyDisplay extends GameObjects.Container {
  private readonly STEP = 10;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, []);

    // this.add(
    //   scene.add.circle(
    //     0,
    //     0,
    //     this.STEP / 2,
    //     Phaser.Display.Color.HexStringToColor("#EABE3F").color
    //   ).setOrigin(0,0)
    // );
    scene.add.existing(this)
  }
}
