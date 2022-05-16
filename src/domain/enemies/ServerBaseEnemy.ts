import { BaseEnemy } from "./BaseEnemy";
import { BaseEnemyCombat } from "./BaseEnemyCombat";
import { BaseEnemyMovement } from "./BaseEnemyMovement";
import { EnemyInfo } from "./EnemyInfo";
import { EnemyState } from "./EnemyState";
import { EnemyStats } from "./EnemyStats";
import { EnemyView } from "./EnemyView";

export class ServerBaseEnemy extends BaseEnemy {
  private movement: BaseEnemyMovement;
  public readonly combat: BaseEnemyCombat;

  constructor(
    state: EnemyState,
    info: EnemyInfo,
    stats: EnemyStats,
    view: EnemyView
  ) {
    super(state, info, stats, view);
    this.movement = new BaseEnemyMovement(this);
    this.combat = new BaseEnemyCombat()
  }

  update(time: number, delta: number): void {
    this.movement.update(time, delta);
    this.updateState({
      position: this.view.positionVector,
      velocity: this.view.velocity,
    });
  }
}
