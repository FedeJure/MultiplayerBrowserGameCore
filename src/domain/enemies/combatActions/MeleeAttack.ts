import { CombatAction, CombatActionExecution } from "../../combat/combatAction";
import { ServerEnemy } from "../serverEnemy";

export class MeleeAttack implements CombatAction {
  private enemy: ServerEnemy;
  init(enemy: ServerEnemy) {
    this.enemy = enemy;
  }
  execute(): CombatActionExecution | undefined {
    if (
      this.enemy.combat.target &&
      Phaser.Math.Distance.BetweenPoints(
        this.enemy.state.position,
        this.enemy.combat.target.state.position
      ) < this.enemy.stats.meleeDistance
    ) {
      this.enemy.combat.target.receiveAttack({
        damage: this.enemy.stats.meleeDamage,
      });
      return { duration: this.enemy.stats.basicAttackSpeed * 1000 };
    }
    return undefined;
  }
}
