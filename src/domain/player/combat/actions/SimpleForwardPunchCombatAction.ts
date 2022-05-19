import { CombatAction } from "./combatAction";
import { ControllablePlayer } from "../../players/controllablePlayer";
import { Side } from "../../../side";
import { CombatResult } from "../combatResult";
import {
  EntityAnimationCode,
  AnimationLayer,
} from "../../../entity/animations";

export class SimpleForwardPunchCombatAction implements CombatAction {
  constructor(private player: ControllablePlayer) {}

  execute() {
    const range = this.player.stats.meleeDistance;
    const { input } = this.player;
    if (input.basicAttack && !input.up && !input.down) {
      if (this.player.state.grounded) {
        this.player.updateState({
          velocity: { x: 0, y: 0 },
        });
      }
      const attackDuration = 1000 / this.player.stats.basicAttackSpeed;

      this.player.animSystem.executeAnimation(
        EntityAnimationCode.BASIC_ATTACK,
        AnimationLayer.COMBAT,
        false,
        attackDuration
      );

      const x =
        this.player.state.position.x -
        this.player.view.width / 2 -
        (this.player.state.side === Side.RIGHT ? 0 : range);
      const y = this.player.state.position.y;
      this.player
        .getAttackablesOnArea(
          x,
          y,
          this.player.view.width + range,
          this.player.view.height / 2
        )
        .forEach((player) => {
          player.receiveAttack(this.getAttackResult());
        });
      return { duration: attackDuration };
    }
  }

  getAttackResult(): CombatResult {
    return {
      damage: this.player.stats.meleeDamage,
    };
  }
}
