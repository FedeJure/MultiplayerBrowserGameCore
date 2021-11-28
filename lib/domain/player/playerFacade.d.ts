import { PlayerView } from "./playerView";
import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";
export interface PlayerFacade {
    view: PlayerView;
    info: PlayerInfo;
    state: PlayerState;
}
