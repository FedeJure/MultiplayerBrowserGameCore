import { CombatResult } from "../player/combat/combatResult";

export interface Attackable {
  receiveAttack(attack: CombatResult);
}