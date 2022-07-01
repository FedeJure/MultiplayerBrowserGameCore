import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Exit } from "../../domain/environment/exit";

export class PhaserExitView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    exit: Exit,
    collisionMananger: CollisionManager,
    originX: number,
    originY: number
  ) {
    const {position: {x,y}, height, width} = exit
    super(scene, x, y, width, height);
    this.setData('exit', exit)
    this.setOrigin(originX, originY);
    collisionMananger.addExit(this)
  }
}
