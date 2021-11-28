import { PhaserPlayerView } from "../../view/playerView";
import { PlayerInput } from "../player/playerInput";
import { PlayerState } from "../player/playerState";
export declare class ResolvePlayerMovementWithInputs {
    constructor();
    execute(input: PlayerInput, view: PhaserPlayerView, state: PlayerState, deltaTime: number): PlayerState;
    processJump(): void;
}
