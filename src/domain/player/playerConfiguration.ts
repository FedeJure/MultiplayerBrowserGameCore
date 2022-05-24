import { RIGHT } from "phaser";
import { Side } from "../side";

export interface PlayerConfiguration {
  initialLife: number;
  initialJumps: number;
  height: number;
  width: number;
  initialSide: Side;
  initialX: number;
  initialY: number;
}

export const DefaultConfiguration: PlayerConfiguration = {
  initialLife: 100,
  initialJumps: 2,
  height: 37,
  width: 25,
  initialSide: RIGHT,
  initialX: 0,
  initialY: 100,
};
