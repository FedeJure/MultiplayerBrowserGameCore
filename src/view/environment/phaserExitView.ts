import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Exit } from "../../domain/environment/exit";

export class PhaserExitView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    exit: Exit,
    collisionMananger: CollisionManager
  ) {
    super(scene, x, y, width, height);
    this.setData('exit', exit)
    this.setOrigin(0, 0);
    collisionMananger.addExit(this)
  }
}
