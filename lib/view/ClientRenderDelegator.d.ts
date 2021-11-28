import { PlayerView } from "./playerView";
import { RenderDelegator } from "./RenderDelegator";
export declare class PlayerRenderDelegator implements RenderDelegator {
    renderLocalPlayer(player: PlayerView): void;
    renderPlayer(player: PlayerView): void;
    createAnimations(player: PlayerView): void;
}
