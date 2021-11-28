import { GameScene } from "../view/scenes/GameScene";
import { CreateClientPlayerAction } from "../domain/actions/provideClientPlayer";
import { CreateLocalClientPlayer } from "../domain/actions/provideLocalClientPlayer";
import { ServerConnection } from "../domain/serverConnection";
import { ConnectedPlayersRepository } from "../infrastructure/repositories/connectedPlayersRepository";
export declare class ClientGamePresenter {
    readonly connection: ServerConnection;
    readonly scene: GameScene;
    readonly localPlayerId: string;
    readonly createClientPlayerAction: CreateClientPlayerAction;
    readonly createLocalPlayerAction: CreateLocalClientPlayer;
    readonly playersRepository: ConnectedPlayersRepository;
    constructor(localPlayerId: string, connection: ServerConnection, scene: GameScene, createClientPlayer: CreateClientPlayerAction, createLocalPlayer: CreateLocalClientPlayer, playersRepository: ConnectedPlayersRepository);
    listenEvents(): void;
}
