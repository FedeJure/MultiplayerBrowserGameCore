import { GameObjects, Scene } from "phaser";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { Ladder } from "../../domain/environment/ladder";

export class PhaserLadderView extends GameObjects.Rectangle {
  constructor(
    scene: Scene,
    ladder: Ladder,
    collisionManager: CollisionManager
  ) {
    const {
      position: { x, y },
      height,
      width,
    } = ladder;
    super(scene, x, y, width, height);
    this.setData("ladder", ladder);
    this.scene.physics.add.existing(this, false);
    this.setOrigin(0, 0);

    collisionManager.addLadder(this);
  }
}

export function IsInsideLadder(gameObject: GameObjects.GameObject & {x: number, y: number}) {
  const ladder: Ladder | undefined = gameObject.getData('ladder') 
  if (!ladder) return false
  const {x, y} = gameObject
  const isInsideLadder = !(x < ladder.position.x ||
      y < ladder.position.y ||
      x > ladder.position.x + ladder.width ||
      y > ladder.position.y + ladder.height)
  if (ladder && !isInsideLadder) gameObject.setData('ladder', undefined) 
  return isInsideLadder
}