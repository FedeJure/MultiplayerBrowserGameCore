import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";

export interface InputWithTickDto extends PlayerInputDto {
    tick: number;
  }
  