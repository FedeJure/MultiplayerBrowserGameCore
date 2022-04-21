import { Socket } from "socket.io";
import { DefaultPlayerInventory } from "../../infrastructure/configuration/DefaultPlayerInventory";
import { DefaultPlayerState } from "../../infrastructure/configuration/DefaultPlayerState";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerSocketInput } from "../../infrastructure/input/playerSocketInput";
import { Log } from "../../infrastructure/Logger";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { ServerProvider } from "../../infrastructure/providers/serverProvider";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { GameScene } from "../../view/scenes/GameScene";
import { ServerPlayerView } from "../../view/serverPlayerView";
import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { CompleteMapDelegator } from "../environment/completeMapDelegator";
import { RoomManager } from "../roomManager";
import { DefaultConfiguration } from "./playerConfiguration";
import { InGamePlayersRepository } from "./inGamePlayersRepository";
import { ServerPlayer } from "./serverPlayer";
import { AsyncRepository } from "../repository";
import { PlayerInfo } from "./playerInfo";
import { PlayerInventoryDto } from "../../infrastructure/dtos/playerInventoryDto";

export class ServerPlayerCreatorDelegator implements Delegator {
  constructor(
    private connectionsRepository: ConnectionsRepository,
    private gameScene: GameScene,
    private socket: Socket,
    private roomManager: RoomManager,
    private playerInfoRepository: AsyncRepository<PlayerInfo>,
    private playerStateRepository: PlayerStateRepository,
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    private presenterProvider: ServerPresenterProvider,
    private inGamePlayersRepository: InGamePlayersRepository<ServerPlayer>
  ) {}
  init(): void {
    this.connectionsRepository.onNewConnection().subscribe((connection) => {
      connection.onPlayerConnection().subscribe(async ({ playerId }) => {
        try {
          const player = await this.createPlayerInGame(
            playerId,
            this.gameScene,
            connection
          );

          const { foundedMap, neighborMaps } =
            CompleteMapDelegator.getMapForPlayer(player.state);

          connection.sendInitialStateEvent(
            Array.from(this.inGamePlayersRepository.getAll()).map((player) => ({
              id: player[0],
              state: player[1].state,
              info: player[1].info,
            })),
            foundedMap,
            neighborMaps
          );

          if (!foundedMap || !neighborMaps) return;

          //WARNING duplicated code
          //TODO: convert completeMapDelegator into MapManager and move all logic there
          const joinedRooms = await this.roomManager.joinToRoom(
            playerId,
            connection,
            [foundedMap, ...neighborMaps]
          );
          connection.sendMapUpdateEvent(foundedMap, neighborMaps);
          this.socket.in(joinedRooms).emit(
            GameEvents.NEW_PLAYER_CONNECTED.name,
            GameEvents.NEW_PLAYER_CONNECTED.getEvent({
              id: player.info.id,
              info: player.info,
              state: player.state,
            })
          );

          Log(
            this,
            `[Game addPlayer] player added to scene with id: ${playerId}`
          );
        } catch (error) {
          Log(this, `[Game addPlayer] ERROR: ${error}`);
        }
      });
    });

    this.connectionsRepository.onDisconnection().subscribe((connection) => {
      const playerId = connection.playerId
      if (playerId) {
        const player = this.inGamePlayersRepository.get(playerId);

        if (player) {
          this.socket
            .in(player.state.currentRooms)
            .emit(
              GameEvents.PLAYER_DISCONNECTED.name,
              GameEvents.PLAYER_DISCONNECTED.getEvent(playerId)
            );
          player.destroy();
          this.inGamePlayersRepository.remove(playerId);
        }
      }
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  async createPlayerInGame(
    playerId: string,
    scene: GameScene,
    connection: ClientConnection
  ) {
    const playerInfo = await this.playerInfoRepository.get(playerId);
    if (playerInfo === undefined)
      throw new Error(`Player with ID: ${playerId} not found`);

    let playerState = this.playerStateRepository.get(playerId);
    if (!playerState) {
      this.playerStateRepository.save(playerId, DefaultPlayerState);
      playerState = DefaultPlayerState;
    }

    try {
      this.inventoryRepository.get(playerId);
    } catch (error) {
      this.inventoryRepository.save(playerId, DefaultPlayerInventory);
    }

    const view = new ServerPlayerView(
      scene,
      playerState.position.x,
      playerState.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width
    );
    const player = new ServerPlayer(
      playerInfo,
      playerState,
      view,
      connection,
      this.playerInfoRepository,
      this.playerStateRepository
    );
    this.presenterProvider.forPlayer(
      view,
      player,
      new PlayerSocketInput(
        playerId,
        connection,
        ServerProvider.playerInputRequestRepository
      )
    );

    this.inGamePlayersRepository.save(player);
    return player;
  }
}
