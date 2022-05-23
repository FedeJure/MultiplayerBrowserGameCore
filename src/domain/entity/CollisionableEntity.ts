import { Entity } from "./entity";
import { AttackTargetType } from "../combat/attackTargetType";

export interface CollisionableEntity {
  type: AttackTargetType;
  target: Entity;
}
