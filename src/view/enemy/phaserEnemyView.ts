import { GameObjects, Physics } from "phaser";
import { EnemyView } from "../../domain/enemies/EnemyView";

export class PhaserEnemyView
  extends GameObjects.Container
  implements EnemyView
{
  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view.scene, x, y, [view]);
    this.setName("Enemy View");
  }
}
