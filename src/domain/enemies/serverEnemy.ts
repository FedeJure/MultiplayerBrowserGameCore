import { Observable, Subject } from "rxjs";
import { Attackable } from "../combat/attackTarget";
import { EnemyCombat } from "./BaseEnemyCombat";
import { BaseEnemyMovement } from "./BaseEnemyMovement";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { ServerEnemyView } from "./ServerEnemyView";
import { Entity } from "../entity/entity";
import { EnemyView } from "./EnemyView";

export class ServerEnemy
  extends Entity<EnemyInfo, EnemyState, EnemyView, EnemyStats, EnemyCombat>
  implements Attackable
{
  private movement: BaseEnemyMovement;
  private _onDestroy = new Subject<void>();

  constructor(
    state: EnemyState,
    info: EnemyInfo,
    stats: EnemyStats,
    view: ServerEnemyView
  ) {
    super(info, state, view, stats, new EnemyCombat());
    this.movement = new BaseEnemyMovement(this);
  }

  get view() {
    return this._view as ServerEnemyView;
  }

  update(time: number, delta: number): void {
    try {
      this.combat.update(time,delta)
      this.movement.update(time, delta);
      this.updateState({
        position: this.view.positionVector,
        velocity: this.view.velocity,
      });
    } catch (error) {}
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
