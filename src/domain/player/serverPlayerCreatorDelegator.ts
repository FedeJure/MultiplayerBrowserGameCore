import { Socket } from "socket.io";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { ConnectedPlayersRepository } from "../../infrastructure/repositories/connectedPlayersRepository";
import { ConnectionsRepository } from "../../infrastructure/repositories/connectionsRepository";
import { PlayerConnectionsRepository } from "../../infrastructure/repositories/playerConnectionsRespository";
import { GameScene } from "../../view/scenes/GameScene";
import { CreatePlayerFromId } from "../actions/providePlayerFromId";
import { Delegator } from "../delegator";
import { CompleteMapDelegator } from "../environment/completeMapDelegator";
import { RoomManager } from "../roomManager";

export class ServerPlayerCreatorDelegator implements Delegator {
  constructor(
    private connectionsRepository: ConnectionsRepository,
    private createPlayer: CreatePlayerFromId,
    private gameScene: GameScene,
    private playerConnections: ConnectedPlayersRepository,
    private socket: Socket,
    private roomManager: RoomManager,
    private playerConnectionsRepository: PlayerConnectionsRepository
  ) {}
  init(): void {
    this.connectionsRepository.onNewConnection().subscribe((connection) => {
      connection.onPlayerConnection().subscribe(async ({ playerId }) => {
        try {
          const player = this.createPlayer.execute(
            playerId,
            this.gameScene,
            connection
          );
          this.playerConnections.savePlayer(playerId, player);
          const { foundedMap, neighborMaps } =
            CompleteMapDelegator.getMapForPlayer(player.state);
          connection.sendInitialStateEvent(
            Array.from(this.playerConnections.getAll()).map((player) => ({
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
        const player = this.playerConnections.getPlayer(playerId);

        if (player) {
          this.socket
            .in(player.state.currentRooms)
            .emit(
              GameEvents.PLAYER_DISCONNECTED.name,
              GameEvents.PLAYER_DISCONNECTED.getEvent(playerId)
            );
          player.destroy();
          this.playerConnections.removePlayer(playerId);
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
}
