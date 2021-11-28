import { ClientPresenterProvider } from "./clientPresenterProvider";
import { ConnectedPlayersRepository } from "../repositories/connectedPlayersRepository";
import { LocalPlayerRepository } from "../repositories/localPlayerRepository";
import { SocketServerConnection } from "../socketServerConnection";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
export declare class ClientProvider {
    private static _serverConnection;
    private static _localPlayerRepository;
    static Init(serverConnection: SocketServerConnection, localPlayerRepository: LocalPlayerRepository): void;
    static get playerStateRepository(): PlayerStateRepository;
    static get presenterProvider(): ClientPresenterProvider;
    static get serverConnection(): SocketServerConnection;
    static get localPlayerRepository(): LocalPlayerRepository;
    static get connectedPlayers(): ConnectedPlayersRepository;
    static get collisionsDispatcher(): CollisionsDispatcher;
    static get playerInputRequestRepository(): PlayerInputRequestRepository;
}
