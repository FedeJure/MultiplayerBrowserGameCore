import { CollisionableEntity } from "../../entity/CollisionableEntity";

export interface CombatCollisionResolver {
  getTargetsOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): CollisionableEntity[];
}
