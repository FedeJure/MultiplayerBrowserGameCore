import { Socket } from "socket.io-client";
import { GameScene } from "../view/GameScene";
import { CoreProvider } from "../coreProvider";
import { RenderDelegator } from "../view/RenderDelegator";
import { PlayerFacade } from "./playerFacade";
export declare class ClientGame {
    readonly socket: Socket;
    readonly provider: CoreProvider;
    readonly scene: GameScene;
    readonly render: RenderDelegator;
    readonly localPlayerId: number;
    localPlayer: PlayerFacade | undefined;
    connectedPlayers: Map<number, PlayerFacade>;
    constructor(localPlayerId: number, coreProvider: CoreProvider, socket: Socket, scene: GameScene);
    listenEvents(): void;
}
