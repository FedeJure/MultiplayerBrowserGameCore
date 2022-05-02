import { AnimationCode, AnimationLayer } from "../../../animations/animations";
import { LocalClientPlayer } from "../../players/localClientPlayer";
import { CombatAction } from "./combatAction";

export class DefendCombatAction implements CombatAction {
  constructor(
    private player: LocalClientPlayer
  ) {}
  execute() {
    const { input } = this.player;
    if (
      !this.player.state.attacking &&
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
        this.player.updateState({attacking: true})
        this.player.view.scene.time.delayedCall(attackDuration, () => {
            this.player.updateState({
              attacking: false,
            });
          });
    }
  }
}
