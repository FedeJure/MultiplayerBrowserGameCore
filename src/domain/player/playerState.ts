import { EntityState } from "../entity/entityState";
import { CombatPlayerState } from "./playerCombatState";

export interface PlayerState extends EntityState {
  readonly jumpsAvailable: number;
  readonly inInertia: boolean;
  readonly canMove: boolean;
  readonly canJump: boolean;
  readonly inputNumber: number;
  readonly currentRooms: string[];
  readonly jumping: boolean
  readonly attacking: boolean
  readonly playerCombarState: CombatPlayerState
}
