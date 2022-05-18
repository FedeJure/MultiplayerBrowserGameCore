import { Scene } from "phaser";
import { EnemiesStatesEvent } from "../../infrastructure/events/gameEvents";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { SpinePhaserEntityView } from "../../view/entity/spinePhaserEntityView";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { ServerConnection } from "../serverConnection";
import { Enemy } from "./enemy";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";

export class ClientEnemyCreatorDelegator implements Delegator {
  private lastTimeCleanup: number = 0;
  private readonly cleanupTime = 100;
  constructor(
    private scene: Scene,
    private serverConnection: ServerConnection,
    private spawnedEnemies: SimpleRepository<Enemy>,
    private presenterProvider: ClientPresenterProvider,
  ) {}
  init(): void {
    this.serverConnection.onEnemyState.subscribe((event) => {
      event.enemyStates.enemies.forEach((enemy) => {
        const existentEnemy = this.spawnedEnemies.get(enemy.info.id);
        if (!existentEnemy)
          this.createEnemy(enemy.state, enemy.info, enemy.stats);
        else existentEnemy.updateState(enemy.state);
        if (this.lastTimeCleanup + this.cleanupTime < Date.now()) {
          this.cleanUp(event);
        }
      });
    });
  }
  private createEnemy(state: EnemyState, info: EnemyInfo, stats: EnemyStats) {
    const view = new SpinePhaserEntityView(
      this.scene,
      state.position.x,
      state.position.y,
      stats.height,
      stats.width,
      info.name
    );
    const enemy = new Enemy(state, info, view, stats);
    this.presenterProvider.forEnemy(view, enemy);
    this.spawnedEnemies.save(enemy.info.id, enemy);
  }

  private cleanUp(event: EnemiesStatesEvent) {
    this.lastTimeCleanup = Date.now();
    this.spawnedEnemies.getAll().forEach((enemy) => {
      if (!event.enemyStates.enemies.find((e) => e.info.id === enemy.info.id)) {
        this.spawnedEnemies.remove(enemy.info.id);
        enemy.destroy();
      }
    });
  }

  stop(): void {}
  update(time: number, delta: number): void {}
}
