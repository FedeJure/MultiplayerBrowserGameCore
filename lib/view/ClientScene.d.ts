import { PlayerFacade } from "../domain/playerFacade";
import { GameScene } from "./GameScene";
export declare class ClientScene extends GameScene {
    preload(): void;
    create(): void;
    addPlayers(players: Array<PlayerFacade>): void;
}
