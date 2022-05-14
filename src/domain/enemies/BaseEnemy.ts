import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./Enemy";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class BaseEnemy implements Enemy {
  private _state: EnemyState;
  constructor(
    state: EnemyState,
    readonly info: EnemyInfo,
    readonly stats: EnemyStats,
    readonly view: EnemyView
  ) {
    this._state = state;
  }
  get state() {
    return this._state;
  }
  updateState(state: Partial<EnemyState>) {
    this._state = { ...this._state, ...state };
  }
  receiveAttack(attack: CombatResult) {}
  update(time: number, delta: number) {}
  destroy() {
      this.view.destroy()
  }
}
