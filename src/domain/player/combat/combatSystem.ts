import { CombatAction } from "./actions/combatAction";
import { ServerPlayer } from "../players/serverPlayer";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { CombatResult } from "./combatResult";
import { AnimationCode, AnimationLayer } from "../../animations/animations";

export class CombatSystem {
  constructor(
    private player: LocalClientPlayer | ServerPlayer,
    private actions: CombatAction[]
  ) {}

  processCombat(delta: number) {
    for (const action of this.actions) {
      if (action.execute()) return;
    }
    if (!this.player.state.attacking)
      this.player.animSystem.executeAnimation(
        AnimationCode.EMPTY_ANIMATION,
        AnimationLayer.COMBAT
      );
  }

  executeAttackAction(duration: number) {}

  receiveAttack(attack: CombatResult) {
    if (attack.damage > 0)
      this.player.animSystem.executeAnimation(
        AnimationCode.TAKING_DAMAGE,
        AnimationLayer.COMBAT,
        false
      );
    this.player.view.scene.time.delayedCall(200, () => {
      this.player.animSystem.executeAnimation(
        AnimationCode.TAKING_DAMAGE,
        AnimationLayer.COMBAT,
        false
      );
    });
    this.player.updateState({
      life: this.player.state.life - attack.damage,
    });
  }
}
