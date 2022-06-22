import { Entity } from "./entity";
import { CollisionableTargetType } from "../combat/attackTargetType";

export interface CollisionableEntity {
  type: CollisionableTargetType;
  target: Entity;
}
