import { BodyType } from "matter";
import { GameObjects, Scene } from "phaser";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";

export class ShapeCollisioner extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width*2, height, 0xffffff);
    this.scene.matter.add.gameObject(this, { isStatic: true, isSensor: false,ignoreGravity: true  });
    const body = this.body as BodyType;

    // this.scene.matter.setCollisionGroup([body], -CollisionCategory.Entity);
    // this.scene.matter.setCollisionCategory([body], CollisionCategory.Entity);
    // this.scene.matter.setCollidesWith(
    //   [body],
    //   [
    //     CollisionCategory.StaticEnvironment,
    //     CollisionCategory.WorldBounds,
    //     CollisionCategory.DamageArea,
    //   ]
    // );
  }
}
