import { CombatResult } from "../player/combat/combatResult";
import { Entity } from "./entity";

export interface EntityCombat {
  init(entity: Entity);
  update(time: number, delta: number);
  receiveAttack(attack: CombatResult);
}

export class EmptyCombat implements EntityCombat {
  init(entity: Entity) {}
  update(time: number, delta: number) {}
  receiveAttack(attack: CombatResult) {}
}
