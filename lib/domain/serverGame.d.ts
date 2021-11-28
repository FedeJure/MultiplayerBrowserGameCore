import { GameScene } from "../view/GameScene";
import { CoreProvider } from "../coreProvider";
import { ClientConnection } from "./clientConnection";
import { RenderDelegator } from "../view/RenderDelegator";
export declare class ServerGame {
    readonly gameScene: GameScene;
    readonly provider: CoreProvider;
    readonly render: RenderDelegator;
    private connectedPlayers;
    constructor(gameScene: GameScene, coreProvider: CoreProvider);
    listenEvents(): void;
    addPlayer(playerId: string, connection: ClientConnection): void;
}
