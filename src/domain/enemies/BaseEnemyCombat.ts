import { AttackTarget } from "../combat/attackTarget";
import { AttackTargetType } from "../combat/attackTargetType";
import { Entity } from "../entity/entity";
import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./enemy";

export class EnemyCombat {
  private _target: Entity | null = null;

  constructor(private enemy: Enemy) {
    setInterval(() => {
      this.processCloseTargets(this.enemy.view.getEntitiesClose(300));
    }, 500);
  }
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
    });
    if (this.enemy.state.life <= 0) this.die();
  }

  private die() {
    setTimeout(() => {
      this.enemy.destroy();
    }, 50);
  }

  private processCloseTargets(targets: AttackTarget[]) {
    const filterTargets = targets.filter(t => t.type === AttackTargetType.PLAYER)
    if (this._target && filterTargets.length === 0) {
      this._target = null
    }
    filterTargets.map(({target, type}) => {
        this._target = target
    })
  }
}
