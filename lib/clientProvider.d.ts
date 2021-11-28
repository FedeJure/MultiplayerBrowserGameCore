import { ClientPresenterProvider } from "./infrastructure/clientPresenterProvider";
import { ConnectedPlayersRepository } from "./infrastructure/repositories/connectedPlayersRepository";
import { LocalPlayerRepository } from "./infrastructure/repositories/localPlayerRepository";
import { SocketServerConnection } from "./infrastructure/socketServerConnection";
export declare class ClientProvider {
    private static _serverConnection;
    private static _localPlayerRepository;
    static Init(serverConnection: SocketServerConnection, localPlayerRepository: LocalPlayerRepository): void;
    static get presenterProvider(): ClientPresenterProvider;
    static get serverConnection(): SocketServerConnection;
    static get localPlayerRepository(): LocalPlayerRepository;
    static get connectedPlayers(): ConnectedPlayersRepository;
}
