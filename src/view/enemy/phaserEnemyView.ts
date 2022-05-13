import { Physics } from "phaser";
import { EnemyView } from "../../domain/enemies/EnemyView";
import { PhaserEntityView } from "../controllable/phaserEntityView";

export class PhaserEnemyView extends PhaserEntityView implements EnemyView {
  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view, x, y, height, width);
    this.setName("Enemy View");
  }
}
