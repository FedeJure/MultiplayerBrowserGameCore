import { Vector } from "matter";
import { Map } from "../environment/mapConfiguration";
import { AnimationDto } from "./AnimationDto";
import { Side } from "../side";

export interface EntityState {
    readonly life: number;
    readonly position: Vector;
    readonly velocity: Vector;
    readonly anim: AnimationDto[];
    readonly mapId: Map['id'];
    readonly side: Side;
    readonly grounded: boolean;
    readonly isAlive: boolean
}