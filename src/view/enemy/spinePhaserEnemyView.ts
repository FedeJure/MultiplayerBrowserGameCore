import { Scene } from "phaser";
import { EnemyView } from "../../domain/enemies/EnemyView";
import { EntityIngameHud } from "../entity/entityIngameHud";
import { SpinePhaserEntityView } from "../entity/spinePhaserEntityView";
import { ExistentDepths } from "../existentDepths";

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
    this.arcadeBody.setAllowGravity(false)
    this.hud = new EntityIngameHud(scene, 0, -height, height, 50, false);
    this.hud.setDisplayName(name);
    this.add(this.hud)
    this.spine.setDepth(ExistentDepths.ENTITIES);
  }
}
