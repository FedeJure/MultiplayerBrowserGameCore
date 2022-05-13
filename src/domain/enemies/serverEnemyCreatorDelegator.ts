import Phaser, { Scene } from "phaser";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";
import { BaseEnemy } from "./BaseEnemy";
import { Enemy } from "./Enemy";
import { EnemyAnimation } from "./EnemyAnimations";
import { SpiderEnemyModel } from "./enemyModel/spiderEnemyModel";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyState } from "./EnemyState";

export class ServerEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private enemiesRepository: SimpleRepository<Enemy>,
    private roomManager: RoomManager
  ) {}
  init(): void {
    // here, create a EnemySpawner on each enemy spot (from map or random)
    new EnemySpawner(600, 600, 3, 3000, 10000, (x, y) => {
      const state: EnemyState = {
        life: SpiderEnemyModel.stats.maxLife,
        position: { x, y },
        anim: EnemyAnimation.IDLE,
        map: 0,
      };
      const view = new PhaserEnemyView(
        this.scene.matter.add.sprite(state.position.x, state.position.y, ""),
        state.position.x,
        state.position.y,
        SpiderEnemyModel.stats.height,
        SpiderEnemyModel.stats.width
      );
      const enemy = new BaseEnemy(
        state,
        {
          name: SpiderEnemyModel.name,
          id: Phaser.Utils.String.UUID(),
        },
        SpiderEnemyModel.stats,
        view
      );
      this.roomManager.joinEnemyToRoom(
        enemy.info.id,
        [enemy.state.map.toString()],
        []
      );
      this.enemiesRepository.save(enemy.info.id, enemy);
      return enemy;
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
