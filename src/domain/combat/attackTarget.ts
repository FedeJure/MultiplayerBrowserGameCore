import { CombatResult } from "../player/combat/combatResult";
import { AttackTargetType } from "./attackTargetType"


export interface AttackTarget {
    type: AttackTargetType
    target: Attackable
}

export interface Attackable {
  receiveAttack(attack: CombatResult);
}