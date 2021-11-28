import { Player } from "../domain/player/player";
import { PlayerInput } from "../domain/player/playerInput";
import { PhaserPlayerView } from "../view/playerView";
import { GameScene } from "../view/scenes/GameScene";
export interface PresenterProvider {
    forLocalPlayer(view: PhaserPlayerView, input: PlayerInput, player: Player): void;
    forPlayer(view: PhaserPlayerView, player: Player): void;
    forGameplay(scene: GameScene): void;
}
