import { PlayerInput } from "../playerInput";
import { CombatAction } from "./actions/combatAction";
import { Player } from "../players/player";

export class CombatSystem {
    constructor(private actions: CombatAction[]) {}

    processCombat(player: Player, input: PlayerInput) {
        this.actions.forEach(action => action.execute(player, input))
    }
}