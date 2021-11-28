import { PlayerConfiguration } from "./playerConfiguration";
import { PlayerInfo } from "./playerInfo";
import { PlayerView } from "../view/playerView";
import { PlayerFacade } from "./playerFacade";
import { PlayerState } from "./playerState";
export declare class Player implements PlayerFacade {
    readonly config: PlayerConfiguration;
    readonly state: PlayerState;
    readonly info: PlayerInfo;
    readonly view: PlayerView;
    constructor(config: PlayerConfiguration, playerInfo: PlayerInfo, playerState: PlayerState, playerView: PlayerView);
    destroy(): void;
}
