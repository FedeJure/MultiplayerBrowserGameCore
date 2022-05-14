import { Side } from "../side";
import { Enemy } from "./Enemy";

export class BaseEnemyMovement {
  private lastTimeMove: number = 0;

  constructor(private enemy: Enemy) {}

  update(time: number, delta: number) {
    if (this.lastTimeMove + 4000 < Date.now()) {
      this.enemy.updateState({
        side: this.enemy.state.side === Side.LEFT ? Side.RIGHT : Side.LEFT,
      });
      this.lastTimeMove = Date.now();
    }
    this.enemy.view.setVelocity(
      (this.enemy.state.side === Side.LEFT ? -1 : 1) *
        this.enemy.stats.idleMovementSpeed,
      this.enemy.view.velocity.y
    );
  }
}
