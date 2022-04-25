import { CombatAction } from "./actions/combatAction";
import { ServerPlayer } from "../players/serverPlayer";
import { LocalClientPlayer } from "../players/localClientPlayer";

export class CombatSystem {
    constructor(private actions: CombatAction[]) {}

    processCombat(player: LocalClientPlayer | ServerPlayer, delta: number) {
        this.actions.forEach(action => action.execute(player))
    }
}