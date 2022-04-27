import { CombatResult } from "../combatResult";

export interface CombatAction {
    execute()
    getAttackResult(): CombatResult
}