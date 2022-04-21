import { Socket } from "socket.io";
import { DefaultPlayerInventory } from "../../infrastructure/configuration/DefaultPlayerInventory";
import { DefaultPlayerState } from "../../infrastructure/configuration/DefaultPlayerState";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerSocketInput } from "../../infrastructure/input/playerSocketInput";
import { Log } from "../../infrastructure/Logger";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { ServerProvider } from "../../infrastructure/providers/serverProvider";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerConnectionsRepository } from "../../infrastructure/repositories/playerConnectionsRespository";
import { PlayerInfoRepository } from "../../infrastructure/repositories/playerInfoRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { GameScene } from "../../view/scenes/GameScene";
import { ServerPlayerView } from "../../view/serverPlayerView";
import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { CompleteMapDelegator } from "../environment/completeMapDelegator";
import { InventoryRepository } from "../items/inventoryRepository";
import { RoomManager } from "../roomManager";
import { Player2_0 } from "./player2.0";
import { DefaultConfiguration } from "./playerConfiguration";
import { PlayersRepository2_0 } from "./playersRepository2.0";

export class ServerPlayerCreatorDelegator implements Delegator {
  constructor(
    private connectionsRepository: ConnectionsRepository,
    private gameScene: GameScene,
    private socket: Socket,
    private roomManager: RoomManager,
    private playerConnectionsRepository: PlayerConnectionsRepository,
    private playerInfoRepository: PlayerInfoRepository,
    private playerStateRepository: PlayerStateRepository,
    private inventoryRepository: InventoryRepository,
    private presenterProvider: ServerPresenterProvider,
    private inGamePlayersRepository: PlayersRepository2_0
  ) {}
  init(): void {
    this.connectionsRepository.onNewConnection().subscribe((connection) => {
      connection.onPlayerConnection().subscribe(async ({ playerId }) => {
        try {
          const player = this.createPlayerInGame(
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
          this.playerConnectionsRepository.addConnection(
            playerId,
            connection.connectionId
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
      const playerId = this.playerConnectionsRepository.getPlayer(
        connection.connectionId
      );
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
        this.playerConnectionsRepository.removeConnection(
          playerId,
          connection.connectionId
        );
      }
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}

  createPlayerInGame(playerId: string,
    scene: GameScene,
    connection: ClientConnection) {
      const playerInfo = this.playerInfoRepository.getPlayer(playerId);
      if (playerInfo === undefined)
        throw new Error(`Player with ID: ${playerId} not found`);
  
      let playerState = this.playerStateRepository.getPlayerState(playerId);
      if (!playerState) {
        this.playerStateRepository.setPlayerState(playerId, DefaultPlayerState);
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
      const player = new Player2_0(playerInfo, playerState, view);
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
