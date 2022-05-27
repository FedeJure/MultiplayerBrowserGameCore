import {
  EntityAnimationCode,
  AnimationLayer,
} from "../../../entity/animations";
import { ControllablePlayer } from "../../players/controllablePlayer";
import { CombatAction } from "../../../combat/combatAction";

export class DefendCombatAction implements CombatAction {
  private player: ControllablePlayer;
  init(player: ControllablePlayer) {
    this.player = player;
  }
  execute() {
    const { input } = this.player;
    if (input.defend && !input.up && !input.down) {
      const attackDuration = 1000 / this.player.stats.basicAttackSpeed;
      this.player.animations.executeAnimation(
        EntityAnimationCode.DEFEND,
        AnimationLayer.COMBAT,
        false,
        attackDuration
      );
      return { duration: attackDuration };
    }
  }
}
