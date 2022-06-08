import { Scene } from "phaser";
import { EnemyView } from "../../domain/enemies/EnemyView";
import { SpinePhaserEntityView } from "../entity/spinePhaserEntityView";

export class SpinePhaserEnemyView
  extends SpinePhaserEntityView
  implements EnemyView
{
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string
  ) {
    super(scene, x, y, height, width, name, "slime");
  }
}
