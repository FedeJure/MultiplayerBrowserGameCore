import { ClientPlayer } from "../player";
import { PlayerInput } from "../playerInput";

export interface CombatAction {
    execute(player: ClientPlayer, input: PlayerInput)
}