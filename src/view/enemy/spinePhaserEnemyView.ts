import { BodyType } from "matter";
import { GameObjects, Scene } from "phaser";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";
import { ClientProvider } from "../../infrastructure/providers/clientProvider";
import { SpinePhaserEntityView } from "../entity/spinePhaserEntityView";

export class SpinePhaserEnemyView extends SpinePhaserEntityView {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string
  ) {
    super(scene, x, y, height, width, name);
    this.setName("Enemy View");
  }
}
