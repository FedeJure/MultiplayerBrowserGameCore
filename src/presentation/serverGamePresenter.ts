import { GameEvents } from "../infrastructure/events/gameEvents";
import { GameScene } from "../view/scenes/GameScene";
import { RoomConnection } from "../domain/roomConnection";
import { Log } from "../infrastructure/Logger";
import { CreatePlayerFromId } from "../domain/actions/providePlayerFromId";
import { ConnectionsRepository } from "../infrastructure/repositories/connectionsRepository";
import { ConnectedPlayersRepository } from "../infrastructure/repositories/connectedPlayersRepository";
import { PlayerStateRepository } from "../infrastructure/repositories/playerStateRepository";

export class ServerGamePresenter {
  readonly gameScene: GameScene
  readonly room: RoomConnection
  readonly createPlayer: CreatePlayerFromId
  readonly connectionsRepository: ConnectionsRepository
  readonly connectedPlayers: ConnectedPlayersRepository
  readonly playerStates: PlayerStateRepository

  private playerConnections: Map<string, string>;

  constructor(gameScene: GameScene,
    room: RoomConnection,
    createPlayerFromId: CreatePlayerFromId,
    connectionsRepository: ConnectionsRepository,
    connectedPlayers: ConnectedPlayersRepository,
    playerStates: PlayerStateRepository) {
    this.gameScene = gameScene
    this.room = room
    this.createPlayer = createPlayerFromId
    this.connectionsRepository = connectionsRepository
    this.connectedPlayers = connectedPlayers
    this.playerStates = playerStates
    this.playerConnections = new Map();

    this.gameScene.onCreate.subscribe(() => {
      this.listenEvents();
    });
  }

  listenEvents() {
    this.connectionsRepository
      .onNewConnection()
      .subscribe((connection) => {
        connection.onPlayerConnection().subscribe(({ playerId }) => {
          try {
            const player = this.createPlayer.execute(
              playerId,
              this.gameScene,
              connection
            );
            this.connectedPlayers.savePlayer(
              playerId,
              player
            );
            this.playerConnections.set(connection.connectionId, playerId);
            connection.sendInitialStateEvent(
              Array.from(this.connectedPlayers
                .getAll()).map(player => ({id: player[0], state: player[1].state, info: player[1].info}))
            );
            this.room.emit(
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

    this.connectionsRepository
      .onDisconnection()
      .subscribe((connection) => {
        const playerId = this.playerConnections.get(connection.connectionId);
        if (playerId) {
          this.room.emit(
            GameEvents.PLAYER_DISCONNECTED.name,
            GameEvents.PLAYER_DISCONNECTED.getEvent(playerId)
          );
          const player =
            this.connectedPlayers.getPlayer(playerId);
          if (player) {
            player.destroy();
            this.connectedPlayers.removePlayer(playerId);
          }
        }
        this.playerConnections.delete(connection.connectionId);
      });

    this.gameScene.onUpdate.subscribe(({ time, delta }) => {
      this.room.emit(
        GameEvents.PLAYERS_STATES.name,
        GameEvents.PLAYERS_STATES.getEvent(this.playerStates.getAll())
      );
    });
  }
}
