
import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Entrance } from "../../domain/environment/entrance";

export class PhaserEntranceView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    entrance: Entrance,
    collisionMananger: CollisionManager
  ) {
    super(scene, x, y, width, height);
    this.setData('entrance', entrance)
    this.setOrigin(0, 0);
    collisionMananger.addEntrance(this)
  }
}
