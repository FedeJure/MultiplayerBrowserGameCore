import { CombatAction, CombatActionExecution } from "../../combat/combatAction";
import { EntityAnimationCode, AnimationLayer } from "../../entity/animations";
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
      const duration = 1000 / this.enemy.stats.basicAttackSpeed;
      this.enemy.updateState({attackAnimation: {
        name: EntityAnimationCode.BASIC_ATTACK,
        layer: AnimationLayer.COMBAT,
        loop: false,
        duration
    }})

      this.enemy.combat.target.combat.receiveAttack({
        damage: this.enemy.stats.meleeDamage,
        attacker: this.enemy
      });
      return { duration };
    }
    return undefined;
  }
}
