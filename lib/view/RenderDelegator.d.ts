import { PlayerView } from "./playerView";
export interface RenderDelegator {
    renderLocalPlayer(localPlayer: PlayerView): void;
    renderPlayer(player: PlayerView): void;
}
