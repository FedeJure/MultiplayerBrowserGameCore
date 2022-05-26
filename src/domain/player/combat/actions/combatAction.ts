import { ControllablePlayer } from "../../players/controllablePlayer";

export interface CombatAction {
    init(player: ControllablePlayer)
    execute(): undefined | CombatActionExecution
}

export interface CombatActionExecution {
    duration: number
}