import { GameEvents } from "../infrastructure/events/gameEvents";
import { GameScene } from "../view/scenes/GameScene";
import { RoomConnection } from "../domain/roomConnection";
import { Log } from "../infrastructure/Logger";
import { CreatePlayerFromId } from "../domain/actions/providePlayerFromId";
import { ConnectionsRepository } from "../infrastructure/repositories/connectionsRepository";
import { ConnectedPlayersRepository } from "../infrastructure/repositories/connectedPlayersRepository";
import { PlayerStateRepository } from "../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../domain/delegator";
import { PlayerConnectionsRepository } from "../infrastructure/repositories/playerConnectionsRespository";
import { CompleteMapDelegator } from "../domain/environment/completeMapDelegator";
import { RoomManager } from "../domain/roomManager";
import { Socket } from "socket.io";
import { PlayerState } from "../domain/player/playerState";

export class ServerGamePresenter {
  constructor(
    private readonly gameScene: GameScene,
    private readonly socket: Socket,
    private readonly createPlayer: CreatePlayerFromId,
    private readonly connectionsRepository: ConnectionsRepository,
    private readonly connectedPlayers: ConnectedPlayersRepository,
    private readonly playerStates: PlayerStateRepository,
    private readonly delegators: Delegator[],
    private readonly playerConnectionsRepository: PlayerConnectionsRepository,
    private readonly roomManager: RoomManager
  ) {
    this.listenEvents();

    this.gameScene.onCreate.subscribe(() => {
      this.delegators.forEach((d) => d.init());
    });
  }

  listenEvents() {
    this.connectionsRepository.onNewConnection().subscribe((connection) => {
      connection.onPlayerConnection().subscribe(async ({ playerId }) => {
        try {
          const player = this.createPlayer.execute(
            playerId,
            this.gameScene,
            connection
          );
          this.connectedPlayers.savePlayer(playerId, player);
          const { foundedMap, neighborMaps } =
            CompleteMapDelegator.getMapForPlayer(player.state);
          connection.sendInitialStateEvent(
            Array.from(this.connectedPlayers.getAll()).map((player) => ({
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
        const player = this.connectedPlayers.getPlayer(playerId);

        if (player) {
          this.socket
            .in(player.state.currentRooms)
            .emit(
              GameEvents.PLAYER_DISCONNECTED.name,
              GameEvents.PLAYER_DISCONNECTED.getEvent(playerId)
            );
          player.destroy();
          this.connectedPlayers.removePlayer(playerId);
        }
        this.playerConnectionsRepository.removeConnection(
          playerId,
          connection.connectionId
        );
      }
    });
    this.gameScene.onUpdate.subscribe(({ time, delta }) => {
      this.delegators.forEach((d) => d.update(time, delta));
      const playersByRoom = this.roomManager.getPlayersByRoom();
      for (const roomId in playersByRoom) {
        if (Object.prototype.hasOwnProperty.call(playersByRoom, roomId)) {
          const players = playersByRoom[roomId] ?? [];
          const states = {};
          players.forEach((p) => {
            const state = this.playerStates.getPlayerState(p);

            if (state) states[p] = state;
          });
          this.socket
            .in(roomId)
            .emit(
              GameEvents.PLAYERS_STATES.name,
              GameEvents.PLAYERS_STATES.getEvent(states)
            );
        }
      }
    });
  }
}
