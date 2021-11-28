import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";
export interface PlayerInput {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    toDto(): PlayerInputDto;
}
