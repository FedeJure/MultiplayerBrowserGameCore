import { GameScene } from "../../view/scenes/GameScene";
import { PlayerInfo } from "../player/playerInfo";
import { PlayerState } from "../player/playerState";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
export declare class CreateClientPlayerAction {
    private readonly presenterProvider;
    private readonly connectedPlayersRepository;
    private readonly playerStateRepository;
    constructor(presenterProvider: ClientPresenterProvider, connectedPlayersRepository: ConnectedPlayersRepository, playerStateRepository: PlayerStateRepository);
    execute(info: PlayerInfo, state: PlayerState, scene: GameScene): void;
}
