import { PlayerInput } from "../domain/player/playerInput";
import { PresenterProvider } from "../presentation/presenterProvider";
import { PhaserPlayerView } from "../view/playerView";
import { GameScene } from "../view/scenes/GameScene";
export declare class ClientPresenterProvider implements PresenterProvider {
    forLocalPlayer(view: PhaserPlayerView, input: PlayerInput): void;
    forPlayer(view: PhaserPlayerView): void;
    forGameplay(scene: GameScene): void;
}
