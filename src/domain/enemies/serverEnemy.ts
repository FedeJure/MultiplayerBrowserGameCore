import { Observable, Subject } from "rxjs";
import { Attackable } from "../combat/attackTarget";
import { EnemyCombat } from "./BaseEnemyCombat";
import { EnemyMovement } from "./enemyMovement";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { ServerEnemyView } from "./ServerEnemyView";
import { Entity } from "../entity/entity";

export class ServerEnemy
  extends Entity<
    EnemyInfo,
    EnemyState,
    ServerEnemyView,
    EnemyStats,
    EnemyCombat
  >
  implements Attackable
{
  private _onDestroy = new Subject<void>();

  constructor(
    state: EnemyState,
    info: EnemyInfo,
    stats: EnemyStats,
    view: ServerEnemyView,
    combat: EnemyCombat
  ) {
    super(
      info,
      state,
      view,
      stats,
      new EnemyMovement(),
      combat
    );
  }

  update(time: number, delta: number): void {
      super.update(time,delta)
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
