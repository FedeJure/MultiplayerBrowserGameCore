import { CollisionableEntity } from "../entity/CollisionableEntity";
import { AttackTargetType } from "../combat/attackTargetType";
import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./enemy";
import { Entity } from "../entity/entity";
import { EntityCombat } from "../entity/entityCombat";

export class EnemyCombat implements EntityCombat {
  private _target: Entity | null = null;
  private readonly intervalTimeCheck = 500;
  private lastTimeCheck = 0;
  private enemy: Enemy

  init(enemy: Enemy) {
    this.enemy = enemy
  }
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    if (this.enemy.state.reseting) return
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
    });
    if (this.enemy.state.life <= 0) this.enemy.die();
  }

  private processCloseTargets(targets: CollisionableEntity[]) {
    const filterTargets = targets.filter(
      (t) => t.type === AttackTargetType.PLAYER
    );
    if (this._target && filterTargets.length === 0) {
      this._target = null;
    }
    if (filterTargets.find((t) => t.target === this.target)) return;
    filterTargets.map(({ target }) => {
      this._target = target;
    });
  }

  update(time: number, delta: number) {

    if (this.lastTimeCheck + this.intervalTimeCheck < time) {
      this.lastTimeCheck = time;
      this.processCloseTargets(
        this.enemy.view.getEntitiesClose(this.enemy.stats.detectionRange)
      );
    }
  }
}
