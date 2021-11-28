import { Player } from "../../domain/player/player";
import { GameScene } from "../../view/scenes/GameScene";
import { PhaserPlayerView } from "../../view/playerView";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { ClientConnection } from "../clientConnection";
import { PlayerSocketInput } from "../../infrastructure/input/playerSocketInput";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PlayerCollisionDelegator } from "../collisions/playerCollisionDelegator";
import { ServerProvider } from "../../infrastructure/providers/serverProvider";
import { DefaultPlayerState } from "../../infrastructure/configuration/DefaultPlayerState";

export class CreatePlayerFromId {
  private readonly infoRepository: PlayerInfoRepository;
  private readonly stateRepository: PlayerStateRepository;
  private readonly presenterProvider: ServerPresenterProvider;
  private readonly connectedPlayersRepository: ConnectedPlayersRepository;

  constructor(
    infoRepository: PlayerInfoRepository,
    stateRepository: PlayerStateRepository,
    presenterProvider: ServerPresenterProvider,
    connectedPlayersRepository: ConnectedPlayersRepository
  ) {
    this.infoRepository = infoRepository;
    this.stateRepository = stateRepository;
    this.presenterProvider = presenterProvider;
    this.connectedPlayersRepository = connectedPlayersRepository;
  }

  public execute(
    playerId: string,
    scene: GameScene,
    connection: ClientConnection
  ) {
    const playerInfo = this.infoRepository.getPlayer(playerId);
    if (playerInfo === undefined)
      throw new Error(`Player with ID: ${playerId} not found`);
    const playerState =
      this.stateRepository.getPlayerState(playerId) || DefaultPlayerState;
    const view = new PhaserPlayerView(
      scene,
      playerState.position.x,
      playerState.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width
    );
    scene.addToLifecycle(view);
    const player = new Player(playerInfo, playerState, view);
    this.presenterProvider.forPlayer(
      player,
      new PlayerSocketInput(playerId, connection, ServerProvider.playerInputRequestRepository)
    );

    this.connectedPlayersRepository.savePlayer(playerId, player);
    return player;
  }
}
