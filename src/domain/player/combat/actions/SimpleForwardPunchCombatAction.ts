import { AnimationCode } from "../../../animations/animations";
import { ClientPlayer } from "../../player";
import { PlayerInput } from "../../playerInput";
import { CombatAction } from "../combatAction";

export class SimpleForwardPunchCombatAction implements CombatAction {
  execute(player: ClientPlayer, input: PlayerInput) {
    if (
      !player.state.attacking &&
      input.basicAttack &&
      !input.up &&
      !input.down
    ) {
      if (player.state.grounded) {
        player.updateState({ attacking: true });
      }
      player.updateState({ anim: AnimationCode.BASIC_ATTACK });
      setTimeout(() => {
        player.updateState({ attacking: false });
      }, 200);
    }
  }
}
