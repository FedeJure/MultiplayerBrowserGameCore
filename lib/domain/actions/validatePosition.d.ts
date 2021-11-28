import { Player } from "../player/player";
import { PlayerState } from "../player/playerState";
export declare class ValidateStateAction {
    constructor();
    execute(player: Player, remoteState: PlayerState): void;
}
