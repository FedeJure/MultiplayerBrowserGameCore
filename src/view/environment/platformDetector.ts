import { BodyType } from "matter";
import { Scene } from "phaser";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";

export class PlatformDetector {
  public static Type = "PlatformDetector";
  private readonly body: BodyType;
  constructor(scene: Scene, x: number, y: number) {
    this.body = scene.matter.add.circle(x, y, 30, {
      ignoreGravity: true,
      isSensor: true,
      isStatic: true,
    });
    this.body.type = PlatformDetector.Type;

    scene.matter.setCollisionCategory(
      [this.body],
      CollisionCategory.StaticEnvironment
    );
    scene.matter.setCollidesWith(
      [this.body],
      [CollisionCategory.Entity, CollisionCategory.StaticEnvironment]
    );
  }
}
