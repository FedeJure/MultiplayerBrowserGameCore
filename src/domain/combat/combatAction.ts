import { Entity } from "../entity/entity";

export interface CombatAction {
    init(player: Entity)
    execute(): undefined | CombatActionExecution
}

export interface CombatActionExecution {
    duration: number
}