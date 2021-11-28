import { PlayerView } from "./playerView";
import { RenderDelegator } from "./RenderDelegator";
export declare class ServerRenderDelegator implements RenderDelegator {
    renderLocalPlayer(localPlayer: PlayerView): void;
    renderPlayer(player: PlayerView): void;
}
