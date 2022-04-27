import { CombatAction } from "./actions/combatAction";
import { ServerPlayer } from "../players/serverPlayer";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { CombatResult } from "./combatResult";

export class CombatSystem {
  constructor(
    private player: LocalClientPlayer | ServerPlayer,
    private actions: CombatAction[]
  ) {}

  processCombat(delta: number) {
    this.actions.forEach((action) => action.execute());
  }

  receiveAttack(attack: CombatResult) {
    this.player.updateState({ life: this.player.state.life - attack.damage });
  }
}
