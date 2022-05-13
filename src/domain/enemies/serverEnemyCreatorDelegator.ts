import Phaser, { Scene } from "phaser";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { Delegator } from "../delegator";
import { BaseEnemy } from "./BaseEnemy";
import { EnemyAnimation } from "./EnemyAnimations";
import { SpiderEnemyModel } from "./enemyModel/spiderEnemyModel";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyState } from "./EnemyState";

export class ServerEnemyCreatorDelegator implements Delegator {
  constructor(private scene: Scene) {}
  init(): void {
    // here, create a EnemySpawner on each enemy spot (from map or random)
    new EnemySpawner(600, 600, 3, 3000, 10000, (x, y) => {
      const state: EnemyState = {
        life: SpiderEnemyModel.stats.maxLife,
        position: { x, y },
        anim: EnemyAnimation.IDLE,
      };
      const view = new PhaserEnemyView(
        this.scene.matter.add.sprite(state.position.x, state.position.y, ""),
        state.position.x,
        state.position.y,
        SpiderEnemyModel.height,
        SpiderEnemyModel.width
      );
      return new BaseEnemy(
        state,
        {
          name: SpiderEnemyModel.name,
          id: Phaser.Utils.String.UUID(),
        },
        SpiderEnemyModel.stats,
        view
      );
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
