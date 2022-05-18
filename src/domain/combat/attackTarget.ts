import { Entity } from "../entity/entity";
import { CombatResult } from "../player/combat/combatResult";
import { AttackTargetType } from "./attackTargetType"


export interface AttackTarget {
    type: AttackTargetType
    target: Entity
}

export interface Attackable {
  receiveAttack(attack: CombatResult);
}