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
    this.actions.forEach((action) => action.execute());
  }

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
