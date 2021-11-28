import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";
import { PhaserPlayerView } from "../../view/playerView";
export declare class Player {
    private _state;
    readonly info: PlayerInfo;
    readonly view: PhaserPlayerView;
    constructor(playerInfo: PlayerInfo, playerState: PlayerState, playerView: PhaserPlayerView);
    get state(): PlayerState;
    destroy(): void;
}
