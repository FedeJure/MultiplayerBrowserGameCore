import { GameScene } from "../../view/scenes/GameScene";
import { PlayerInfo } from "../player/playerInfo";
import { PlayerInput } from "../player/playerInput";
import { PlayerState } from "../player/playerState";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ClientPresenterProvider } from "../../infrastructure/providers/clientPresenterProvider";
export declare class CreateLocalClientPlayer {
    private readonly presenterProvider;
    private readonly connectedPlayersRepository;
    private readonly playerStateRepository;
    constructor(presenterProvider: ClientPresenterProvider, connectedPlayersRepository: ConnectedPlayersRepository, playerStateRepository: PlayerStateRepository);
    execute(info: PlayerInfo, state: PlayerState, scene: GameScene, input: PlayerInput): void;
}
