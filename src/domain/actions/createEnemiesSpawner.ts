import { Scene } from "phaser";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PhaserEnemyView } from "../../view/enemy/phaserEnemyView";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { CollisionManager } from "../collisions/collisionManager";
import { CollisionableTargetType } from "../combat/attackTargetType";
import { EnemyCombat } from "../enemies/BaseEnemyCombat";
import { MeleeAttack } from "../enemies/combatActions/MeleeAttack";
import { Enemy } from "../enemies/enemy";
import { EnemyModel } from "../enemies/enemyModel/enemyModel";
import { EnemySpawner } from "../enemies/EnemySpawner";
import { EnemySpawnerConfig } from "../enemies/enemySpawnerConfig";
import { EnemyState } from "../enemies/EnemyState";
import { ServerEnemy } from "../enemies/serverEnemy";
import { AnimationLayer, EntityAnimationCode } from "../entity/animations";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { LootConfiguration } from "../loot/lootConfiguration";
import { LootGenerator } from "../loot/lootGenerator";
import { AsyncRepository, SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";
import { Side } from "../side";

export async function createEnemiesSpawner(
  scene: Scene,
  spawnerConfig: EnemySpawnerConfig,
  collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
  collisionManager: CollisionManager,
  lootConfigurationRepository: AsyncRepository<LootConfiguration>,
  lootGenerator: LootGenerator,
  roomManager: RoomManager,
  presenterProvider: ServerPresenterProvider,
  enemiesRepository: SimpleRepository<Enemy>,
  enemiesModelRepository: AsyncRepository<EnemyModel>,
  enemiesStatesRepository: AsyncRepository<EnemyState>
) {
  enemiesStatesRepository.clear()
  const model = await enemiesModelRepository.getBy({
    id: spawnerConfig.enemyModelId,
  });
  if (!model) return;
  new EnemySpawner(
    spawnerConfig.position.x,
    spawnerConfig.position.y,
    spawnerConfig.maxEnemies,
    spawnerConfig.minInterval,
    spawnerConfig.maxInterval,
    (x, y) => {
      const info = {
        name: model.name,
        id: enemiesStatesRepository.getId(),
      }
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
      enemiesStatesRepository.save(info.id, state)
      const view = new PhaserEnemyView(
        scene.physics.add.sprite(state.position.x, state.position.y, ""),
        state.position.x,
        state.position.y,
        model.stats.height,
        model.stats.width
      ).setCollisionResolver(
        new PhaserCombatCollisionResolver(
          state.position.x,
          state.position.y,
          scene,
          collisionableTargetRepository
        )
      );
      collisionManager.addEnemy(view);
      const enemy = new ServerEnemy(
        state,
        info,
        model.stats,
        view,
        new EnemyCombat(
          [new MeleeAttack()],
          model.lootConfigId,
          lootConfigurationRepository,
          lootGenerator
        ),
        enemiesStatesRepository
      );
      view.setEntityReference(enemy);
      roomManager.joinEnemyToRoom(
        enemy.info.id,
        [enemy.state.mapId.toString()],
        []
      );
      enemy.onDestroy.subscribe(() => {
        enemiesRepository.remove(enemy.info.id);
        collisionableTargetRepository.remove(view.id);
        roomManager.removeEnemyFromRoom(enemy.info.id, [
          enemy.state.mapId.toString(),
        ]);
      });
      enemiesRepository.save(enemy.info.id, enemy);
      presenterProvider.forEnemy(view, enemy);
      collisionableTargetRepository.save(view.id, {
        target: enemy,
        type: CollisionableTargetType.MOB,
      });

      return enemy;
    }
  );
}
