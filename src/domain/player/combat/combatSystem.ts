import { ClientPlayer } from "../player";
import { PlayerInput } from "../playerInput";
import { CombatAction } from "./combatAction";

export class CombatSystem {
    constructor(private actions: CombatAction[]) {

    }

    processCombat(player: ClientPlayer, input: PlayerInput) {
        this.actions.forEach(action => action.execute(player, input))
    }
}