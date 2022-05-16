import { Map } from "../environment/mapConfiguration";
import { AnimationDto } from "../player/animations/AnimationDto";
import { Side } from "../side";
import { Vector } from "../vector";
import { EnemyAnimation } from "./EnemyAnimations";

export interface EnemyState {
    life: number
    position: Vector,
    velocity: Vector,
    anim: AnimationDto,
    map: Map['id'],
    side: Side
    inCombat: boolean
}
