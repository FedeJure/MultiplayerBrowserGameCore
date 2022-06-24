import { EntityState } from "../entity/entityState";

export interface PlayerState extends EntityState {
  readonly jumpsAvailable: number;
  readonly inInertia: boolean;
  readonly canMove: boolean;
  readonly canJump: boolean;
  readonly inputNumber: number;
  readonly currentRooms: string[];
  readonly jumping: boolean
  readonly attacking: boolean
  readonly exp: number
  readonly inLadder: boolean
}
