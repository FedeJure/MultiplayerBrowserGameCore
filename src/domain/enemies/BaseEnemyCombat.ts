import { CombatResult } from "../player/combat/combatResult";
import { Player } from "../player/players/player";
import { Enemy } from "./Enemy";

export class BaseEnemyCombat {
  private _target: Player | null = null;

  constructor(private enemy: Enemy) {}
  public get target() {
    return this._target;
  }

  receiveAttack(attack: CombatResult) {
    this.enemy.updateState({
      life: this.enemy.state.life - attack.damage,
    });
    console.log(this.enemy.state.life)
    if (this.enemy.state.life <= 0) this.die();
  }

  die() {
    this.enemy.destroy()
  }
}
