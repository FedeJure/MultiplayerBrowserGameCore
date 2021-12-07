import { RIGHT } from "phaser";
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

export const DefaultConfiguration: PlayerConfiguration = {
  initialLife: 100,
  initialJumps: 2,
  height: 37,
  width: 25,
  jumpVelocity: 10,
  runVelocity: 10,
  initialSide: RIGHT,
  initialX: 0,
  initialY: 100,
  jumps: 2,
};
