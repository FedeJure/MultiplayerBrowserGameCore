import { Delegator } from "../delegator";
import { Enemy } from "./enemy";

export class EnemyDelegator implements Delegator {
  constructor(private enemy: Enemy) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
      this.enemy.update(time, delta)
      this.enemy.postUpdate()
  }
}
