import { PlayerInput } from "../../domain/player/playerInput";
import { GameScene } from "../../view/scenes/GameScene";
import { Player } from "../../domain/player/player";
export declare class ClientPresenterProvider {
    forLocalPlayer(input: PlayerInput, player: Player): void;
    forPlayer(player: Player): void;
    forGameplay(scene: GameScene): void;
}
