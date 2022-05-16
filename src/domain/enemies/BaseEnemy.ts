import { CombatResult } from "../player/combat/combatResult";
import { Side } from "../side";
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
  update(time: number, delta: number) {
    this.view.playAnimations([this.state.anim])
    this.view.setVelocity(this.state.velocity.x, this.state.velocity.y);
    this.view.setPosition(this.state.position.x, this.state.position.y)
    this.view.lookToLeft(this.state.side === Side.LEFT);
  }
  destroy() {
    this.view.destroy();
  }
}
