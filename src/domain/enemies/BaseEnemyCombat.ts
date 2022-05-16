import { AnimationCode, AnimationLayer } from "../animations/animations";
import { CombatResult } from "../player/combat/combatResult";
import { ControllablePlayer } from "../player/players/controllablePlayer";
import { Enemy } from "./enemy";

export class EnemyCombat {
  private _target: ControllablePlayer | null = null;

  constructor(private enemy: Enemy) {}
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
      anim: {
        name: AnimationCode.TAKING_DAMAGE,
        layer: AnimationLayer.MOVEMENT,
      },
    });
    if (this.enemy.state.life <= 0) this.die();
  }

  die() {
    setTimeout(() => {
      this.enemy.destroy();
    }, 50);
  }
}
