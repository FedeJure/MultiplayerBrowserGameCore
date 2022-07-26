import { Scene } from "phaser";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { SpinePhaserEnemyView } from "../../view/enemy/spinePhaserEnemyView";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { ServerConnection } from "../serverConnection";
import { Enemy } from "./enemy";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";

export class ClientEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private serverConnection: ServerConnection,
    private spawnedEnemies: SimpleRepository<Enemy>,
    private presenterProvider: ClientPresenterProvider
  ) {}
  init(): void {
    this.serverConnection.onEnemyCreation.subscribe((event) => {
      event.enemiesData.enemies.forEach((enemy) => {
        const existentEnemy = this.spawnedEnemies.get(enemy.info.id);
        if (!existentEnemy)
          this.createEnemy(enemy.state, enemy.info, enemy.stats);
        else existentEnemy.updateState(enemy.state);
      });
    });

    this.serverConnection.onEnemyDestroy.subscribe(({ enemyIds }) => {
      enemyIds.forEach((id) => {
        const enemy = this.spawnedEnemies.get(id);
        if (!enemy) return;
        enemy.destroy();
        this.spawnedEnemies.remove(id);
      });
    });

    this.serverConnection.onEnemiesStates.subscribe(({ enemies }) => {
      enemies.forEach((enemyData) => {
        const enemy = this.spawnedEnemies.get(enemyData.id);
        enemy?.updateState(enemyData);
      });
    });
  }
  private createEnemy(state: EnemyState, info: EnemyInfo, stats: EnemyStats) {
    const view = new SpinePhaserEnemyView(
      this.scene,
      state.position.x,
      state.position.y,
      stats.height,
      stats.width,
      info.name
    );
    const enemy = new Enemy(info, state, view, stats);
    view.setEntityReference(enemy);
    this.presenterProvider.forEnemy(view, enemy);
    this.spawnedEnemies.save(enemy.info.id, enemy);
  }

  stop(): void {}
  update(time: number, delta: number): void {}
}
