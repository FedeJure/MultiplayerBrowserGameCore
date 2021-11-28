import { Side } from "../side";
export interface PlayerConfiguration {
    initialLife: number;
    initialJumps: number;
    height: number;
    width: number;
    jumpVelocity: number;
    runVelocity: number;
    initialSide: Side;
    initialX: number;
    initialY: number;
    jumps: number;
}
export declare const DefaultConfiguration: PlayerConfiguration;
