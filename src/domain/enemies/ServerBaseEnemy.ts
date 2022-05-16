import { Observable, Subject } from "rxjs";
import { Attackable } from "../combat/attackTarget";
import { CombatResult } from "../player/combat/combatResult";
import { BaseEnemy } from "./BaseEnemy";
import { BaseEnemyCombat } from "./BaseEnemyCombat";
import { BaseEnemyMovement } from "./BaseEnemyMovement";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class ServerBaseEnemy extends BaseEnemy implements Attackable {
  private movement: BaseEnemyMovement;
  public readonly combat: BaseEnemyCombat;
  private _onDestroy = new Subject<void>();

  constructor(
    state: EnemyState,
    info: EnemyInfo,
    stats: EnemyStats,
    view: EnemyView
  ) {
    super(state, info, stats, view);
    this.movement = new BaseEnemyMovement(this);
    this.combat = new BaseEnemyCombat(this);
  }

  update(time: number, delta: number): void {
    try {
      this.movement.update(time, delta);
      this.updateState({
        position: this.view.positionVector,
        velocity: this.view.velocity,
      });
    } catch (error) {}
  }

  receiveAttack(attack: CombatResult) {
    this.combat.receiveAttack(attack);
  }

  destroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
    super.destroy();
  }

  get onDestroy(): Observable<void> {
    return this._onDestroy;
  }
}
