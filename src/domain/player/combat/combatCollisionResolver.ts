import { CollisionableEntity } from "../../entity/CollisionableEntity";
import { Loot } from "../../loot/loot";

export interface CombatCollisionResolver {
  getTargetsOnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): CollisionableEntity[];
  getLootsOnDistance(
    x:number,
    y:number,
    distance: number
  ) : Loot[]
}
