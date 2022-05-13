import { Map } from "../environment/mapConfiguration";
import { Vector } from "../vector";
import { EnemyAnimation } from "./EnemyAnimations";

export interface EnemyState {
    life: number
    position: Vector,
    anim: EnemyAnimation,
    map: Map['id']
}
