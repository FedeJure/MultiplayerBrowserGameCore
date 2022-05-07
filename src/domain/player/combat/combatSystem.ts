import { CombatAction } from "./actions/combatAction";
import { ServerPlayer } from "../players/serverPlayer";
import { ControllablePlayer } from "../players/controllablePlayer";
import { CombatResult } from "./combatResult";
import { AnimationCode, AnimationLayer } from "../../animations/animations";

export class CombatSystem {
  private attacking: boolean;
  constructor(
    private player: ControllablePlayer | ServerPlayer,
    private actions: CombatAction[]
  ) {}

  processCombat(delta: number) {
    if (!this.attacking) {
      for (const action of this.actions) {
        const execution = action.execute();
        if (execution) {
          this.player.updateState({ attacking: true });
          this.attacking = true;
          this.player.view.scene.time.delayedCall(execution.duration, () => {
            this.attacking = false;
          });
          return;
        }
      }
      this.player.updateState({ attacking: false });
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
    this.player.updateState({
      life: this.player.state.life - attack.damage,
    });
  }
}
