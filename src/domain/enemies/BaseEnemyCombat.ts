import { CollisionableEntity } from "../entity/CollisionableEntity";
import { AttackTargetType } from "../combat/attackTargetType";
import { CombatResult } from "../player/combat/combatResult";
import { Enemy } from "./enemy";
import { Entity } from "../entity/entity";
import { CombatAction } from "../combat/combatAction";
import { EntityAnimationCode, AnimationLayer } from "../entity/animations";
import { DefaultEntityCombat } from "../entity/DefaultEntityCombat";

export class EnemyCombat extends DefaultEntityCombat {
  private _target: Entity | null = null;
  private readonly intervalTimeCheck = 500;
  private lastTimeCheck = 0;
  private enemy: Enemy;
  private attacking: boolean;

  constructor(private actions: CombatAction[]) {
    super();
  }

  init(enemy: Enemy) {
    this.enemy = enemy;
    super.init(enemy);
    this.actions.forEach((a) => a.init(this.enemy));
  }
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    if (this.enemy.state.reseting) return;
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
    });
    if (this.enemy.state.life <= 0) this.die();
  }

  die() {
    this.enemy.animations.executeAnimation(
      EntityAnimationCode.DIE,
      AnimationLayer.COMBAT,
      false,
      1000
    );
    this.enemy.view.setVelocity(0, this.enemy.state.velocity.y);
    this.enemy.updateState({ isAlive: false });
    setTimeout(() => {
      this.enemy.destroy();
    }, 1000);
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

    if (!this.attacking && this.target) {
      for (const action of this.actions) {
        const execution = action.execute();
        if (execution) {
          this.enemy.updateState({ attacking: true });
          this.attacking = true;
          setTimeout(() => {
              this.attacking = false;
          }, execution.duration);
          return;
        }
      }
      this.enemy.updateState({ attacking: false });
    }
    super.update(time, delta);
  }
}
