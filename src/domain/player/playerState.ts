import { currentMapState } from "../environment/currentMapState";
import { Side } from "../side";
import { Vector } from "../vector";
import { AnimationDto } from "./animations/AnimationDto";

export interface PlayerState {
  readonly life: number;
  readonly jumpsAvailable: number;
  readonly inInertia: boolean;
  readonly canMove: boolean;
  readonly position: Vector;
  readonly velocity: Vector;
  readonly canJump: boolean;
  readonly grounded: boolean;
  readonly side: Side;
  readonly inputNumber: number;
  readonly animations: AnimationDto[]
  readonly map: currentMapState;
  readonly currentRooms: string[]
  readonly jumping: boolean
  readonly attacking: boolean
}
