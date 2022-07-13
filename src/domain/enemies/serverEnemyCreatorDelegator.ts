import Phaser, { Scene } from "phaser";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { AnimationLayer, EntityAnimationCode } from "../entity/animations";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { CollisionableTargetType } from "../combat/attackTargetType";
import { Delegator } from "../delegator";
import { AsyncRepository, SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";
import { Side } from "../side";
import { Enemy } from "./enemy";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyState } from "./EnemyState";
import { ServerEnemy } from "./serverEnemy";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { CollisionManager } from "../collisions/collisionManager";
import { EnemyCombat } from "./BaseEnemyCombat";
import { MeleeAttack } from "./combatActions/MeleeAttack";
import { LootConfiguration } from "../loot/lootConfiguration";
import { LootGenerator } from "../loot/lootGenerator";
import { MapManager } from "../environment/mapManager";
import { EnemyModel } from "./enemyModel/enemyModel";
import { EnemySpawnerConfig } from "./enemySpawnerConfig";

export class ServerEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private enemiesRepository: SimpleRepository<Enemy>,
    private roomManager: RoomManager,
    private presenterProvider: ServerPresenterProvider,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
    private collisionManager: CollisionManager,
    private lootConfigsRepository: AsyncRepository<LootConfiguration>,
    private lootGenerator: LootGenerator,
    private mapManager: MapManager,
    private enemiesModelRepository: AsyncRepository<EnemyModel>
  ) {}
  init(): void {
    // here, create a EnemySpawner on each enemy spot (from map or random)
    this.mapManager.maps.forEach((map) => {
      map.enemySpawners.forEach(async (spawnerConfig) => {

        const model = await this.enemiesModelRepository.get(
          spawnerConfig.enemyModelId
        );
        if (!model) return;
        this.instantiateSpawner(model, spawnerConfig);
      });
    });
  }

  private instantiateSpawner(
    model: EnemyModel,
    spawnerConfig: EnemySpawnerConfig
  ) {
    new EnemySpawner(
      spawnerConfig.position.x,
      spawnerConfig.position.y,
      spawnerConfig.maxEnemies,
      spawnerConfig.minInterval,
      spawnerConfig.maxInterval,
      (x, y) => {
        const state: EnemyState = {
          life: model.stats.maxLife,
          position: { x, y },
          anim: [
            { name: EntityAnimationCode.IDLE, layer: AnimationLayer.MOVEMENT },
          ],
          mapId: 0,
          velocity: { x: 0, y: 0 },
          side: Side.RIGHT,
          inCombat: false,
          grounded: true,
          isAlive: true,
          reseting: false,
          attacking: false,
          inLadder: false,
        };
        const view = new PhaserEnemyView(
          this.scene.physics.add.sprite(state.position.x, state.position.y, ""),
          state.position.x,
          state.position.y,
          model.stats.height,
          model.stats.width
        ).setCollisionResolver(
          new PhaserCombatCollisionResolver(
            state.position.x,
            state.position.y,
            this.scene,
            this.collisionableTargetRepository
          )
        );
        this.collisionManager.addEnemy(view);
        const enemy = new ServerEnemy(
          state,
          {
            name: model.name,
            id: Phaser.Utils.String.UUID(),
          },
          model.stats,
          view,
          new EnemyCombat(
            [new MeleeAttack()],
            model.lootConfigId,
            this.lootConfigsRepository,
            this.lootGenerator
          )
        );
        view.setEntityReference(enemy);
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
          type: CollisionableTargetType.MOB,
        });

        return enemy;
      }
    );
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
