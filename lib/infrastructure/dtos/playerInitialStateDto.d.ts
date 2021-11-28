import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayerState } from "../../domain/player/playerState";
export interface PlayerInitialStateDto {
    id: string;
    state: PlayerState;
    info: PlayerInfo;
}
