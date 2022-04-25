import { AnimationCode } from "../../../animations/animations";
import { PlayerInput } from "../../playerInput";
import { CombatAction } from "./combatAction";
import { Player } from "../../players/player";

export class SimpleForwardPunchCombatAction implements CombatAction {
  execute(player: Player, input: PlayerInput) {
    if (
      !player.state.attacking &&
      input.basicAttack &&
      !input.up &&
      !input.down
    ) {
      if (player.state.grounded) {
        player.updateState({
          velocity: { x: 0, y: 0 },
        });
        player.view.setVelocity(0, 0);
      } 

      player.updateState({
        anim: AnimationCode.BASIC_ATTACK,
        attacking: true,
      });
      setTimeout(() => {
        player.updateState({ attacking: false });
      }, 200);
    }
  }
}
