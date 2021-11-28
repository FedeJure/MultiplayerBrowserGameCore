import { Player } from "../../domain/player/player";
import { GameScene } from "../../view/scenes/GameScene";
import { ClientConnection } from "../clientConnection";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
export declare class CreatePlayerFromId {
    private readonly infoRepository;
    private readonly stateRepository;
    private readonly presenterProvider;
    private readonly connectedPlayersRepository;
    constructor(infoRepository: PlayerInfoRepository, stateRepository: PlayerStateRepository, presenterProvider: ServerPresenterProvider, connectedPlayersRepository: ConnectedPlayersRepository);
    execute(playerId: string, scene: GameScene, connection: ClientConnection): Player;
}
