
import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Entrance } from "../../domain/environment/entrance";

export class PhaserEntranceView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    entrance: Entrance,
    collisionMananger: CollisionManager,
    originX: number,
    originY: number
  ) {
    const {position: {x,y}, height, width} = entrance
    super(scene, x, y, width, height);
    this.setData('entrance', entrance)
    this.setOrigin(originX, originY);
    collisionMananger.addEntrance(this)
  }
}
