import { PlayerInput } from "../../playerInput";
import { Player } from "../../players/player";

export interface CombatAction {
    execute(player: Player, input: PlayerInput)
}