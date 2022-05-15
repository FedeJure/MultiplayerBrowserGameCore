import Phaser, { Scene } from "phaser";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";
import { Side } from "../side";
import { Enemy } from "./Enemy";
import { EnemyAnimation } from "./EnemyAnimations";
import { SpiderEnemyModel } from "./enemyModel/spiderEnemyModel";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyState } from "./EnemyState";
import { ServerBaseEnemy } from "./ServerBaseEnemy";

export class ServerEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private enemiesRepository: SimpleRepository<Enemy>,
    private roomManager: RoomManager,
    private presenterProvider: ServerPresenterProvider
  ) {}
  init(): void {
    // here, create a EnemySpawner on each enemy spot (from map or random)
    new EnemySpawner(600, 1600, 10, 1000, 3000, (x, y) => {
      const state: EnemyState = {
        life: SpiderEnemyModel.stats.maxLife,
        position: { x, y },
        anim: EnemyAnimation.IDLE,
        map: 0,
        velocity: { x: 0, y: 0 },
        side: Side.RIGHT,
      };
      const view = new PhaserEnemyView(
        this.scene.matter.add.sprite(state.position.x, state.position.y, ""),
        state.position.x,
        state.position.y,
        SpiderEnemyModel.stats.height,
        SpiderEnemyModel.stats.width
      );
      const enemy = new ServerBaseEnemy(
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
      this.presenterProvider.forEnemy(view, enemy);
      return enemy;
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
