import { Player } from "../../domain/player/player";
import { GameScene } from "../../view/scenes/GameScene";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { ClientConnection } from "../clientConnection";
import { PlayerSocketInput } from "../../infrastructure/input/playerSocketInput";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { ServerProvider } from "../../infrastructure/providers/serverProvider";
import { DefaultPlayerState } from "../../infrastructure/configuration/DefaultPlayerState";
import { ServerPlayerView } from "../../view/serverPlayerView";
import { InventoryRepository } from "../items/inventoryRepository";
import { DefaultPlayerInventory } from "../../infrastructure/configuration/DefaultPlayerInventory";

export class CreatePlayerFromId {
  constructor(
    private infoRepository: PlayerInfoRepository,
    private stateRepository: PlayerStateRepository,
    private presenterProvider: ServerPresenterProvider,
    private connectedPlayersRepository: ConnectedPlayersRepository,
    private inventoryRepository: InventoryRepository
  ) {}

  public execute(
    playerId: string,
    scene: GameScene,
    connection: ClientConnection
  ) {
    const playerInfo = this.infoRepository.getPlayer(playerId);
    if (playerInfo === undefined)
      throw new Error(`Player with ID: ${playerId} not found`);

    let playerState = this.stateRepository.getPlayerState(playerId);
    if (!playerState) {
      this.stateRepository.setPlayerState(playerId, DefaultPlayerState);
      playerState = DefaultPlayerState;
    }

    try {
      this.inventoryRepository.get(playerId)
    } catch (error) {
      this.inventoryRepository.save(playerId, DefaultPlayerInventory)
    }

    const view = new ServerPlayerView(
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
      new PlayerSocketInput(
        playerId,
        connection,
        ServerProvider.playerInputRequestRepository
      )
    );

    this.connectedPlayersRepository.savePlayer(playerId, player);
    return player;
  }
}
