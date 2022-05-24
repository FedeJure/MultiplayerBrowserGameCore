import { Scene } from "phaser";

export class PlatformDetector {
  public static Type = "PlatformDetector";
  private readonly body: Phaser.Physics.Arcade.Body;
  constructor(scene: Scene, x: number, y: number) {
    // this.body = scene.physics.add.existing(scene.add.circle(x, y, 30), true)
    //   .body as Phaser.Physics.Arcade.Body;
  }
}
