
export interface CombatAction {
    execute(): undefined | CombatActionExecution
}

export interface CombatActionExecution {
    duration: number
}