import { ConnectionsRepository } from "./infrastructure/repositories/connectionsRepository";
import { PlayerInfoRepository } from "./infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "./infrastructure/repositories/playerStateRepository";
import { SocketServerConnection } from "./infrastructure/socketServerConnection";
import { PresenterProvider } from "./presentation/presenterProvider";
export declare class Provider {
    private static _connectionsRepository;
    private static _playerInfoRepository;
    private static _playerStateRepository;
    private static _presenterProvider;
    private static _serverConnection;
    static ServierInit(connections: ConnectionsRepository, playerInfos: PlayerInfoRepository, playerStates: PlayerStateRepository, presenterProvider: PresenterProvider): void;
    static ClientInit(presenterProvider: PresenterProvider, serverConnection: SocketServerConnection): void;
    static get connectionsRepository(): ConnectionsRepository;
    static get playerInfoRepository(): PlayerInfoRepository;
    static get playerStateRepository(): PlayerStateRepository;
    static get presenterProvider(): PresenterProvider;
    static get serverConnection(): SocketServerConnection;
}
