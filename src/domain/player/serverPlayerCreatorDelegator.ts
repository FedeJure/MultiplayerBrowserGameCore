import { Socket } from "socket.io";
import { DefaultPlayerInventory } from "../../infrastructure/configuration/DefaultPlayerInventory";
import { DefaultPlayerState } from "../../infrastructure/configuration/DefaultPlayerState";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerSocketInput } from "../../infrastructure/input/playerSocketInput";
import { Log } from "../../infrastructure/Logger";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ServerPlayerView } from "../../view/player/serverPlayerView";
import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { RoomManager } from "../roomManager";
import { DefaultConfiguration } from "./playerConfiguration";
import { ServerPlayer } from "./players/serverPlayer";
import { AsyncRepository, SimpleRepository } from "../repository";
import { PlayerInfo } from "./playerInfo";
import { PlayerInventoryDto } from "../../infrastructure/dtos/playerInventoryDto";
import { Scene } from "phaser";
import { MovementSystem } from "./movement/movementSystem";
import { DefaultPlayerStats, PlayerStats } from "./playerStats";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { AttackTargetType } from "../combat/attackTargetType";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { MapManager } from "../environment/mapManager";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";

export class ServerPlayerCreatorDelegator implements Delegator {
  constructor(
    private connectionsRepository: SimpleRepository<ClientConnection>,
    private gameScene: Scene,
    private socket: Socket,
    private roomManager: RoomManager,
    private playerInfoRepository: AsyncRepository<PlayerInfo>,
    private playerStateRepository: PlayerStateRepository,
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    private presenterProvider: ServerPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
    private playerStatsRepository: AsyncRepository<PlayerStats>,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
    private mapManager: MapManager,
    private playerInputRequestRepository: PlayerInputRequestRepository
  ) {}
  init(): void {
    this.connectionsRepository.onSave.subscribe((connection) => {
      connection.onPlayerConnection().subscribe(async ({ playerId }) => {
        const player = await this.createPlayerInGame(
          playerId,
          this.gameScene,
          connection
        );

        const { foundedMap, neighborMaps } =
          this.mapManager.getMapForPlayer(player);

        connection.sendInitialStateEvent(
          {
            id: player.info.id,
            state: player.state,
            stats: player.stats,
            info: player.info,
          },
          this.inGamePlayersRepository.getAll().map((player) => ({
            id: player.info.id,
            state: player.state,
            info: player.info,
          })),
          foundedMap,
          neighborMaps
        );
        this.inGamePlayersRepository.save(player.info.id, player);

        if (!foundedMap || !neighborMaps) return;

        //WARNING duplicated code
        //TODO: convert completeMapDelegator into MapManager and move all logic there
        const joinedRooms = await this.roomManager.joinToRoom(
          playerId,
          connection,
          [foundedMap, ...neighborMaps]
        );
        player.updateState({ currentRooms: joinedRooms });
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
      });
    });

    this.connectionsRepository.onRemove.subscribe((connection) => {
      const playerId = connection.playerId;
      if (playerId) {
        const player = this.inGamePlayersRepository.get(playerId);

        if (player) {
          this.socket
            .in(player.state.currentRooms)
            .emit(
              GameEvents.PLAYER_DISCONNECTED.name,
              GameEvents.PLAYER_DISCONNECTED.getEvent(playerId)
            );
          // this.collisionableTargetRepository.remove(
          //   player.view.arcadeBody.gameObject.name
          // );

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
    scene: Scene,
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

    const inventory = await this.inventoryRepository.get(playerId);
    if (!inventory)
      await this.inventoryRepository.save(playerId, DefaultPlayerInventory);

    const stats = await this.playerStatsRepository.get(playerId);
    if (!stats)
      await this.playerStatsRepository.save(playerId, DefaultPlayerStats);
    const collisionResolver = new PhaserCombatCollisionResolver(
      playerState.position.x,
      playerState.position.y,
      scene,
      this.collisionableTargetRepository
    );

    const view = new ServerPlayerView(
      scene,
      playerState.position.x,
      playerState.position.y,
      DefaultConfiguration.height,
      DefaultConfiguration.width,
      collisionResolver
    );

    const input = new PlayerSocketInput(
      playerId,
      connection,
      this.playerInputRequestRepository
    );
    const player = new ServerPlayer(
      playerInfo,
      playerState,
      view,
      new MovementSystem(),
      input,
      stats ?? DefaultPlayerStats,
      this.mapManager,
      connection,
      this.playerInfoRepository,
      this.playerStateRepository
    );

    // this.collisionableTargetRepository.save(view.arcadeBody.gameObject.name, {
    //   target: player,
    //   type: AttackTargetType.PLAYER,
    // });
    connection.setPlayerId(player.info.id);
    this.presenterProvider.forPlayer(view, player);

    return player;
  }
}
