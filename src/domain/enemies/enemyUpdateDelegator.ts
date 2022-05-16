import { Delegator } from "../delegator";
import { BaseEnemy } from "./BaseEnemy";

export class EnemyUpdateDelegator implements Delegator {
  constructor(private enemy: BaseEnemy) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    this.enemy.update(time, delta);
  }
}
