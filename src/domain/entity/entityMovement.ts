import { Entity } from "./entity";

export interface EntityMovement {
    init(entity: Entity)
    update(time:number, delta:number)
}