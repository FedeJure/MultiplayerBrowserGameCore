
import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Entrance } from "../../domain/environment/entrance";

export class PhaserEntranceView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    entrance: Entrance,
    collisionMananger: CollisionManager
  ) {
    const {position: {x,y}, height, width} = entrance
    super(scene, x, y, width, height);
    this.setData('entrance', entrance)
    this.setOrigin(0, 0);
    collisionMananger.addEntrance(this)
  }
}
