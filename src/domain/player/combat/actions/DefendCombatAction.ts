import { AnimationCode, AnimationLayer } from "../../../animations/animations";
import { LocalClientPlayer } from "../../players/localClientPlayer";
import { CombatAction } from "./combatAction";

export class DefendCombatAction implements CombatAction {
  constructor(private player: LocalClientPlayer) {}
  execute() {
    const { input } = this.player;
    if (
      input.defend &&
      !input.up &&
      !input.down
    ) {
      const attackDuration = 1000 / this.player.stats.basicAttackSpeed;
      this.player.animSystem.executeAnimation(
        AnimationCode.DEFEND,
        AnimationLayer.COMBAT,
        false,
        attackDuration
      );
      return { duration: attackDuration };
    }
  }
}
