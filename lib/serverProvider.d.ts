import { ConnectedPlayersRepository } from "./infrastructure/repositories/connectedPlayersRepository";
import { ConnectionsRepository } from "./infrastructure/repositories/connectionsRepository";
import { PlayerInfoRepository } from "./infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "./infrastructure/repositories/playerStateRepository";
import { ServerPresenterProvider } from "./infrastructure/serverPresenterProvider";
export declare class ServerProvider {
    static get connectionsRepository(): ConnectionsRepository;
    static get playerInfoRepository(): PlayerInfoRepository;
    static get playerStateRepository(): PlayerStateRepository;
    static get presenterProvider(): ServerPresenterProvider;
    static get connectedPlayerRepository(): ConnectedPlayersRepository;
}
