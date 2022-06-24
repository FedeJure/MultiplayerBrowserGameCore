import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";

const AntiOverlapSize = 25
export class PhaserLadderView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    collisionManager: CollisionManager
  ) {
    super(scene, x, y, width, height);
    this.scene.physics.add.existing(this, false);
    this.setOrigin(0, 0);

    const leftAntiOverlap = scene.add.rectangle(x - (AntiOverlapSize * 2), y, AntiOverlapSize, height)
    leftAntiOverlap.setOrigin(0, 0)
    this.scene.physics.add.existing(leftAntiOverlap, false)

    const rightAntiOverlap = scene.add.rectangle(x + width + (AntiOverlapSize), y, AntiOverlapSize, height)
    rightAntiOverlap.setOrigin(0, 0)
    this.scene.physics.add.existing(rightAntiOverlap, false)

    collisionManager.addLadder(this)
    collisionManager.addAntiLadder(leftAntiOverlap)
    collisionManager.addAntiLadder(rightAntiOverlap)
  }
}
