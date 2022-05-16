import { CombatResult } from "../player/combat/combatResult";
import { ControllablePlayer } from "../player/players/controllablePlayer";
import { Enemy } from "./enemy";

export class BaseEnemyCombat {
  private _target: ControllablePlayer | null = null;

  constructor(private enemy: Enemy) {}
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
    });
    if (this.enemy.state.life <= 0) this.die();
  }

  die() {
    setTimeout(() => {
      this.enemy.destroy();
    }, 50);
  }
}
