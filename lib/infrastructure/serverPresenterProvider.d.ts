import { PlayerInput } from "../domain/player/playerInput";
import { PhaserPlayerView } from "../view/playerView";
export declare class ServerPresenterProvider {
    forPlayer(view: PhaserPlayerView, input: PlayerInput): void;
}
