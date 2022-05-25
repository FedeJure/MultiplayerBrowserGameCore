import { Physics } from "phaser";
import { ServerEnemyView } from "../../domain/enemies/ServerEnemyView";
import { Vector } from "../../domain/vector";
import { PhaserEntityView } from "../entity/phaserEntityView";

export class PhaserEnemyView
  extends PhaserEntityView
  implements ServerEnemyView
{
  constructor(
    readonly view: Physics.Arcade.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view, x, y, height, width);
    this.setName("Enemy View");
  }
  getPlatformDetectorClose(): Vector[] {
    return (
      this.collisionResolver?.getPlatformDetectorsAround(
        this.x,
        this.y,
        this.height * 2
      ) ?? []
    );
  }
}
