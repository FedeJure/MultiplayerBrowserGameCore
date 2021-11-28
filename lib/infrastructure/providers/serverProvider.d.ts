import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { ConnectedPlayersRepository } from "../repositories/connectedPlayersRepository";
import { ConnectionsRepository } from "../repositories/connectionsRepository";
import { PlayerInfoRepository } from "../repositories/playerInfoRepository";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
import { ServerPresenterProvider } from "./serverPresenterProvider";
export declare class ServerProvider {
    static get connectionsRepository(): ConnectionsRepository;
    static get playerInfoRepository(): PlayerInfoRepository;
    static get playerStateRepository(): PlayerStateRepository;
    static get presenterProvider(): ServerPresenterProvider;
    static get connectedPlayerRepository(): ConnectedPlayersRepository;
    static get collisionsDispatcher(): CollisionsDispatcher;
    static get playerInputRequestRepository(): PlayerInputRequestRepository;
}
