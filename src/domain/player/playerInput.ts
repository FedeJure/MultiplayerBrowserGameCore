import { Observable } from "rxjs";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  toDto(): PlayerInputDto;
  inventory: boolean;
  stats: boolean;
  menu: boolean;
  basicAttack: boolean;
  action: boolean;
  defend: boolean;
  skill1: boolean;
  skill2: boolean;
  skill3: boolean;
  skill4: boolean;
  onInventoryChange: Observable<void>
}
