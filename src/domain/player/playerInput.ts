import { Observable } from "rxjs";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  toDto(): PlayerInputDto;
  stats: boolean;
  menu: boolean;
  basicAttack: boolean;
  defend: boolean;
  skill1: boolean;
  skill2: boolean;
  skill3: boolean;
  skill4: boolean;
}

export interface ClientPlayerInput extends PlayerInput {
  onInventoryChange: Observable<void>
  inventory: boolean;
  action: boolean;
  onAction: Observable<void>
  onInputChange: Observable<void>
}