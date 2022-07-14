import { EntityState } from "../entity/entityState";
import { SpawnPoint } from "../environment/spawnPoint";

export interface PlayerState extends EntityState {
  readonly jumpsAvailable: number;
  readonly inInertia: boolean;
  readonly canMove: boolean;
  readonly canJump: boolean;
  readonly inputNumber: number;
  readonly currentRooms: string[];
  readonly jumping: boolean;
  readonly attacking: boolean;
  readonly exp: number;
  readonly transporting: boolean
  readonly lastSpawnPoint: SpawnPoint,
  readonly lastTimeJump: number
}
