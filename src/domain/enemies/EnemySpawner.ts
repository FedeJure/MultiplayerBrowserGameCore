import { ServerBaseEnemy } from "./ServerBaseEnemy";

export class EnemySpawner {
  private enemies: number = 0;
  private timeout: NodeJS.Timeout | null = null;
  constructor(
    private x: number,
    private y: number,
    private maxEnemies: number,
    private minInterval: number,
    private maxInterval: number,
    private spawner: (x: number, y: number) => ServerBaseEnemy
  ) {
    this.spawnEnemy();
    this.scheduleNewSpawn();
  }

  private scheduleNewSpawn() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.scheduleNewSpawn();
      this.spawnEnemy();
    }, Math.random() * this.maxInterval + this.minInterval);
  }

  private spawnEnemy() {
    if (this.enemies >= this.maxEnemies) return;
    const newEnemy = this.spawner(this.x, this.y);
    newEnemy.onDestroy.subscribe(() => {
      this.enemies--;
    });
    this.enemies++;
  }
}
