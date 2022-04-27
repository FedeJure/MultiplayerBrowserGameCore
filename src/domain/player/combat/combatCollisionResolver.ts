import { AttackTarget } from "../../combat/attackTarget";

export interface CombatCollisionResolver {
  getTargetsOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): AttackTarget[];
}
