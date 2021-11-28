import { AnimationCode } from "../animations/animations";
import { Side } from "../side";
export interface PlayerState {
    readonly life: number;
    readonly jumpsAvailable: number;
    readonly inInertia: boolean;
    readonly canMove: boolean;
    readonly position: {
        x: number;
        y: number;
    };
    readonly velocity: {
        x: number;
        y: number;
    };
    readonly canJump: boolean;
    readonly grounded: boolean;
    readonly side: Side;
    readonly inputNumber: number;
    readonly anim: AnimationCode;
}
