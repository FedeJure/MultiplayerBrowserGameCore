import { Scene } from "phaser";

export class PlatformDetector {
  public static Type = "PlatformDetector";
  private readonly body: Phaser.Physics.Arcade.Body;
  constructor(scene: Scene, x: number, y: number) {
    const circle = scene.add.circle(x, y, 30);
    this.body = scene.physics.add.existing(circle, true)
      .body as Phaser.Physics.Arcade.Body;
  }
}
