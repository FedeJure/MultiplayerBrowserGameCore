import { AttackTarget } from "../combat/attackTarget";
import { AttackTargetType } from "../combat/attackTargetType";
import { EntityAnimationCode, AnimationLayer } from "../entity/animations";
import { Entity } from "../entity/entity";
import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./enemy";

export class EnemyCombat {
  private _target: Entity | null = null;
  private readonly intervalTimeCheck = 500;
  private lastTimeCheck = 0;

  constructor(private enemy: Enemy) {}
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
    });
    if (this.enemy.state.life <= 0) this.enemy.die();
  }


  private processCloseTargets(targets: AttackTarget[]) {
    const filterTargets = targets.filter(
      (t) => t.type === AttackTargetType.PLAYER
    );
    if (this._target && filterTargets.length === 0) {
      this._target = null;
    }
    filterTargets.map(({ target, type }) => {
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
