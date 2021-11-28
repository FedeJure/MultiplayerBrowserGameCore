import { PlayerInfo } from "../domain/player/playerInfo";
import { PlayerStateDto } from "../infrastructure/dtos/playerStateDTO";
import { PhaserPlayerView } from "./playerView";
export interface PlayerFacade {
    view: PhaserPlayerView;
    info: PlayerInfo;
    state: PlayerStateDto;
}
