import Phaser, { Scene } from "phaser";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { AnimationLayer, EntityAnimationCode } from "../entity/animations";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { AttackTargetType } from "../combat/attackTargetType";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";
import { Side } from "../side";
import { Enemy } from "./enemy";
import { SpiderEnemyModel } from "./enemyModel/spiderEnemyModel";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyState } from "./EnemyState";
import { ServerEnemy } from "./serverEnemy";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { CollisionManager } from "../collisions/collisionManager";

export class ServerEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private enemiesRepository: SimpleRepository<Enemy>,
    private roomManager: RoomManager,
    private presenterProvider: ServerPresenterProvider,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
    private collisionManager: CollisionManager
  ) {}
  init(): void {
    // here, create a EnemySpawner on each enemy spot (from map or random)
    new EnemySpawner(600, 1600, 1, 1000, 3300, (x, y) => {
      const state: EnemyState = {
        life: SpiderEnemyModel.stats.maxLife,
        position: { x, y },
        anim: [{ name: EntityAnimationCode.IDLE, layer: AnimationLayer.MOVEMENT }],
        mapId: 0,
        velocity: { x: 0, y: 0 },
        side: Side.RIGHT,
        inCombat: false,
        grounded: true,
        isAlive: true,
        reseting: false,
        attacking: false
      };
      const view = new PhaserEnemyView(
        this.scene.physics.add.sprite(state.position.x, state.position.y, ""),
        state.position.x,
        state.position.y,
        SpiderEnemyModel.stats.height,
        SpiderEnemyModel.stats.width
      ).setCollisionResolver(
        new PhaserCombatCollisionResolver(
          state.position.x,
          state.position.y,
          this.scene,
          this.collisionableTargetRepository
        )
      );
      this.collisionManager.addEnemy(view)
      const enemy = new ServerEnemy(
        state,
        {
          name: SpiderEnemyModel.name,
          id: Phaser.Utils.String.UUID(),
        },
        SpiderEnemyModel.stats,
        view
      );
      view.setEntityReference(enemy)
      this.roomManager.joinEnemyToRoom(
        enemy.info.id,
        [enemy.state.mapId.toString()],
        []
      );
      enemy.onDestroy.subscribe(() => {
        this.enemiesRepository.remove(enemy.info.id);
        this.collisionableTargetRepository.remove(view.id);
        this.roomManager.removeEnemyFromRoom(enemy.info.id, [
          enemy.state.mapId.toString(),
        ]);
      });
      this.enemiesRepository.save(enemy.info.id, enemy);
      this.presenterProvider.forEnemy(view, enemy);
      this.collisionableTargetRepository.save(view.id, {
        target: enemy,
        type: AttackTargetType.MOB,
      });

      return enemy;
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
