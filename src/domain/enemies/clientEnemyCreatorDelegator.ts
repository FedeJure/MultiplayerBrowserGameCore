import { Scene } from "phaser";
import { ClientPhaserEnemyView } from "../../view/enemy/clientPhaserEnemyView";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { ServerConnection } from "../serverConnection";
import { BaseEnemy } from "./BaseEnemy";
import { Enemy } from "./Enemy";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";

export class ClientEnemyCreatorDelegator implements Delegator {
  constructor(
    private scene: Scene,
    private serverConnection: ServerConnection,
    private spawnedEnemies: SimpleRepository<Enemy>
  ) {}
  init(): void {
    this.serverConnection.onEnemyState.subscribe((event) => {
      event.enemyStates.enemies.forEach((enemy) => {
        const existentEnemy = this.spawnedEnemies.get(enemy.info.id);
        if (!existentEnemy)
          this.createEnemy(enemy.state, enemy.info, enemy.stats);
        else existentEnemy.updateState(enemy.state);
      });
    });
  }
  private createEnemy(state: EnemyState, info: EnemyInfo, stats: EnemyStats) {
    const view = new ClientPhaserEnemyView(
      this.scene,
      state.position.x,
      state.position.y,
      stats.height,
      stats.width,
      info.name,
      state.anim
    );
    const enemy = new BaseEnemy(state, info, stats, view);
    this.spawnedEnemies.save(enemy.info.id, enemy)
  }

  stop(): void {}
  update(time: number, delta: number): void {}
}
