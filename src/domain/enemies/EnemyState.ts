import { Map } from "../environment/mapConfiguration";
import { Side } from "../side";
import { Vector } from "../vector";
import { EnemyAnimation } from "./EnemyAnimations";

export interface EnemyState {
    life: number
    position: Vector,
    velocity: Vector,
    anim: EnemyAnimation,
    map: Map['id'],
    side: Side
}
