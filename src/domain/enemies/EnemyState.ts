import { Vector } from "../vector";
import { EnemyAnimation } from "./EnemyAnimations";

export interface EnemyState {
    life: number
    position: Vector,
    anim: EnemyAnimation
}
