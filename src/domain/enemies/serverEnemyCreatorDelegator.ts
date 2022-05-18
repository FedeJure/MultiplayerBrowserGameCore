import Phaser, { Scene } from "phaser";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { AnimationLayer } from "../entity/animations";
import { AttackTarget } from "../combat/attackTarget";
import { AttackTargetType } from "../combat/attackTargetType";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";
import { Side } from "../side";
import { Enemy } from "./enemy";
import { EnemyAnimation } from "./EnemyAnimations";
import { SpiderEnemyModel } from "./enemyModel/spiderEnemyModel";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyState } from "./EnemyState";
import { ServerEnemy } from "./serverEnemy";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";

export class ServerEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private enemiesRepository: SimpleRepository<Enemy>,
    private roomManager: RoomManager,
    private presenterProvider: ServerPresenterProvider,
    private attackTargetRepository: SimpleRepository<AttackTarget>
  ) {}
  init(): void {
    // here, create a EnemySpawner on each enemy spot (from map or random)
    new EnemySpawner(600, 1600, 1, 1000, 3300, (x, y) => {
      const state: EnemyState = {
        life: SpiderEnemyModel.stats.maxLife,
        position: { x, y },
        anim: [{ name: EnemyAnimation.IDLE, layer: AnimationLayer.MOVEMENT }],
        mapId: 0,
        velocity: { x: 0, y: 0 },
        side: Side.RIGHT,
        inCombat: false,
        grounded: true,
      };

      const view = new PhaserEnemyView(
        this.scene.matter.add.sprite(state.position.x, state.position.y, ""),
        state.position.x,
        state.position.y,
        SpiderEnemyModel.stats.height,
        SpiderEnemyModel.stats.width
      ).setCollisionResolver(
        new PhaserCombatCollisionResolver(
          state.position.x,
          state.position.y,
          this.scene,
          this.attackTargetRepository
        )
      );
      const enemy = new ServerEnemy(
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
        [enemy.state.mapId.toString()],
        []
      );
      enemy.onDestroy.subscribe(() => {
        this.enemiesRepository.remove(enemy.info.id);
        this.attackTargetRepository.remove(view.matterBody.id.toString());
        this.roomManager.removeEnemyFromRoom(enemy.info.id, [
          enemy.state.mapId.toString(),
        ]);
      });
      this.enemiesRepository.save(enemy.info.id, enemy);
      this.presenterProvider.forEnemy(view, enemy);
      this.attackTargetRepository.save(view.matterBody.id.toString(), {
        target: enemy,
        type: AttackTargetType.MOB,
      });

      return enemy;
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
