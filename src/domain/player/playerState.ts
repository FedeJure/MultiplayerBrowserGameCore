import { AnimationCode } from "../animations/animations";
import { currentMapState } from "../environment/currentMapState";
import { Side } from "../side";
import { AnimationDto } from "./animations/AnimationDto";

export interface PlayerState {
  readonly life: number;
  readonly jumpsAvailable: number;
  readonly inInertia: boolean;
  readonly canMove: boolean;
  readonly position: { x: number; y: number };
  readonly velocity: { x: number; y: number };
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
