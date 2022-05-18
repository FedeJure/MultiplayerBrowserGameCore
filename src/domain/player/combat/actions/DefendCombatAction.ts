import { EntityAnimationCode, AnimationLayer } from "../../../entity/animations";
import { ControllablePlayer } from "../../players/controllablePlayer";
import { CombatAction } from "./combatAction";

export class DefendCombatAction implements CombatAction {
  constructor(private player: ControllablePlayer) {}
  execute() {
    const { input } = this.player;
    if (
      input.defend &&
      !input.up &&
      !input.down
    ) {
      const attackDuration = 1000 / this.player.stats.basicAttackSpeed;
      this.player.animSystem.executeAnimation(
        EntityAnimationCode.DEFEND,
        AnimationLayer.COMBAT,
        false,
        attackDuration
      );
      return { duration: attackDuration };
    }
  }
}
