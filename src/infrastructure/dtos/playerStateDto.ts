import { PlayerState } from "../../domain/player/playerState";

export interface PlayerStateDto {
  id: string;
  state: PlayerState;
}
