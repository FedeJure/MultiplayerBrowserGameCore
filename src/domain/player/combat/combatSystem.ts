import { CombatAction } from "./actions/combatAction";
import { ServerPlayer } from "../players/serverPlayer";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { CombatResult } from "./combatResult";
import { AnimationCode, AnimationLayer } from "../../animations/animations";

export class CombatSystem {
  private attacking: boolean;
  constructor(
    private player: LocalClientPlayer | ServerPlayer,
    private actions: CombatAction[]
  ) {}

  processCombat(delta: number) {
    if (!this.attacking)
      for (const action of this.actions) {
        if (action.execute()) {
          this.attacking = true;
          return;
        }
      }
    if (
      !this.player.state.attacking) {
      this.attacking = false;
      this.player.animSystem.executeAnimation(
        AnimationCode.EMPTY_ANIMATION,
        AnimationLayer.COMBAT
      );
    }
  }

  executeAttackAction(duration: number) {}

  receiveAttack(attack: CombatResult) {
    if (attack.damage > 0)
      this.player.animSystem.executeAnimation(
        AnimationCode.TAKING_DAMAGE,
        AnimationLayer.COMBAT,
        false,
        200
      );
    this.player.view.scene.time.delayedCall(200, () => {
      this.player.animSystem.executeAnimation(
        AnimationCode.EMPTY_ANIMATION,
        AnimationLayer.COMBAT,
        false
      );
    });
    this.player.updateState({
      life: this.player.state.life - attack.damage,
    });
  }
}
