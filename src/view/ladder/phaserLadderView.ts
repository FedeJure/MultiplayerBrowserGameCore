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

    const rightAntiOverlap = scene.add.rectangle(x + width + (AntiOverlapSize), y, AntiOverlapSize, height)
    rightAntiOverlap.setOrigin(0, 0)

    const topAntiOverlap = scene.add.rectangle(x, y - (AntiOverlapSize) * 2, AntiOverlapSize, AntiOverlapSize)
    topAntiOverlap.setOrigin(0, 0)
    
    const bottomAntiOverlap = scene.add.rectangle(x, y + height, AntiOverlapSize, AntiOverlapSize)
    bottomAntiOverlap.setOrigin(0, 0)

    collisionManager.addLadder(this)
    collisionManager.addAntiLadder(leftAntiOverlap)
    collisionManager.addAntiLadder(rightAntiOverlap)
    collisionManager.addAntiLadder(topAntiOverlap)
    collisionManager.addAntiLadder(bottomAntiOverlap)
  }
}
