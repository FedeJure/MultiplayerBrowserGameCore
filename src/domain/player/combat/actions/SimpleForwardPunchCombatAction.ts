import { AnimationCode } from "../../../animations/animations";
import { CombatAction } from "./combatAction";
import { LocalClientPlayer } from "../../players/localClientPlayer";
import { ServerPlayer } from "../../players/serverPlayer";

export class SimpleForwardPunchCombatAction implements CombatAction {
  execute(player: LocalClientPlayer | ServerPlayer) {
    const { input } = player;
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
