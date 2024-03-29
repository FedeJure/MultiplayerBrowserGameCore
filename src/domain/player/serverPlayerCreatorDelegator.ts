import { Socket } from "socket.io";
import { DefaultPlayerInventory } from "../../infrastructure/configuration/DefaultPlayerInventory";
import { DefaultPlayerState } from "../../infrastructure/configuration/DefaultPlayerState";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerSocketInput } from "../../infrastructure/input/playerSocketInput";
import { Log } from "../../infrastructure/Logger";
import { ServerPresenterProvider } from "../../infrastructure/providers/serverPresenterProvider";
import { ServerPlayerView } from "../../view/player/serverPlayerView";
import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { RoomManager } from "../roomManager";
import { DefaultConfiguration } from "./playerConfiguration";
import { ServerPlayer } from "./players/serverPlayer";
import { AsyncRepository, SimpleRepository } from "../repository";
import { PlayerInfo } from "./playerInfo";
import { PlayerInventoryDto } from "../inventory/playerInventoryDto";
import { Scene } from "phaser";
import { DefaultPlayerStats, PlayerStats } from "./playerStats";
import { CollisionableEntity } from "../entity/CollisionableEntity";
import { CollisionableTargetType } from "../combat/attackTargetType";
import { PhaserCombatCollisionResolver } from "../../view/player/combatCollisionResolver";
import { MapManager } from "../environment/mapManager";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { CollisionManager } from "../collisions/collisionManager";
import { ServerPlayerInventory } from "../inventory/serverPlayerInventory";
import { DefaultPlayerBalance } from "../../infrastructure/configuration/DefaultPlayerBalance";
import { ServerBalance } from "../inventory/serverBalance";
import { PlayerTransportation } from "./playerTransportation";
import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { PlayerState } from "./playerState";
import { PlayerBalance } from "../inventory/playerBalance";
import { PlayerRoomChangeEventRepository } from "./playerRoomChangeEventRepository";
import { PlayerServerMovementValidator } from "./movement/serverPlayerMovementValidator";
import { Enemy } from "../enemies/enemy";
import { sendEnemiesDataForRoom } from "../actions/sendEnemiesDataForRooms";

export class ServerPlayerCreatorDelegator implements Delegator {
  constructor(
    private connectionsRepository: SimpleRepository<ClientConnection>,
    private gameScene: Scene,
    private socket: Socket,
    private roomManager: RoomManager,
    private playerInfoRepository: AsyncRepository<PlayerInfo>,
    private playerStateRepository: AsyncRepository<PlayerState>,
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    private presenterProvider: ServerPresenterProvider,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
    private playerStatsRepository: AsyncRepository<PlayerStats>,
    private collisionableTargetRepository: SimpleRepository<CollisionableEntity>,
    private mapManager: MapManager,
    private playerInputRequestRepository: PlayerInputRequestRepository,
    private collisionManager: CollisionManager,
    private balanceRepository: AsyncRepository<PlayerBalance>,
    private roomChangeRepository: PlayerRoomChangeEventRepository,
    private enemiesRepository: SimpleRepository<Enemy>
  ) {}
  init(): void {
    this.connectionsRepository.onSave.subscribe((connection) => {
      connection
        .onPlayerConnection()
        .subscribe(async ({ playerId, callback }) => {
          if (this.inGamePlayersRepository.get(playerId)) {
            callback(
              GameEvents.PLAYER_CONNECTION_RESPONSE.getEvent(
                false,
                "This account is already connected"
              )
            );
            return;
          }
          const player = await this.createPlayerInGame(
            playerId,
            this.gameScene,
            connection,
            this.mapManager
          );
          const foundedMaps = this.mapManager.getMapForPlayer(player);
          if (!foundedMaps) return;
          const { foundedMap, neighborMaps } = foundedMaps;

          connection.sendInitialStateEvent(
            {
              id: player.info.id,
              state: player.state,
              stats: player.stats,
              info: player.info,
              inventory: player.inventory.dto,
              balance: player.balance.dto,
            },
            this.inGamePlayersRepository.getAll().map((player) => ({
              id: player.info.id,
              state: player.state,
              info: player.info,
            })),
            foundedMap,
            neighborMaps,
            [] //TODO: remove this
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
          this.roomChangeRepository.save(playerId, joinedRooms, []);
          player.updateState({ currentRooms: joinedRooms });
          connection.sendMapUpdateEvent(foundedMap, neighborMaps);
          sendEnemiesDataForRoom(
            [foundedMap!.id, ...neighborMaps.map((m) => m.id)].map((id) =>
              id.toString()
            ),
            this.roomManager,
            this.enemiesRepository,
            connection
          );
          this.socket.in(joinedRooms).emit(
            GameEvents.NEW_PLAYER_CONNECTED.name,
            GameEvents.NEW_PLAYER_CONNECTED.getEvent({
              id: player.info.id,
              info: player.info,
              state: player.state,
            })
          );
          callback(
            GameEvents.PLAYER_CONNECTION_RESPONSE.getEvent(
              true,
              "Happy gaming :)"
            )
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
          this.collisionableTargetRepository.remove(player.view.id);

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
    connection: ClientConnection,
    mapManager: MapManager
  ) {
    const playerInfo = await this.playerInfoRepository.get(playerId);
    if (!playerInfo) throw new Error(`Player with ID: ${playerId} not found`);
    let playerState = await this.playerStateRepository.get(playerId);
    if (!playerState) {
      const startMap = mapManager.getMap(DefaultGameConfiguration.initialMapId);
      const startSpawnPoint = startMap.spawnPositions.find((p) => p.default);
      if (!startSpawnPoint)
        throw new Error(
          `The initial Map id:${DefaultGameConfiguration.initialMapId} must have at least one spawn point marked as Default`
        );

      const newState: PlayerState = {
        ...DefaultPlayerState,
        position: {
          x: startSpawnPoint.position.x,
          y: startSpawnPoint.position.y,
        },
        lastSpawnPoint: startSpawnPoint,
      };
      this.playerStateRepository.save(playerId, newState);
      playerState = newState;
    }

    const inventory = await this.inventoryRepository.get(playerId);
    if (!inventory)
      await this.inventoryRepository.save(playerId, DefaultPlayerInventory);

    const balance = await this.balanceRepository.get(playerId);
    if (!balance)
      await this.balanceRepository.save(playerId, {
        playerId,
        ...DefaultPlayerBalance,
      });

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
    this.collisionManager.addPlayer(view);

    const input = new PlayerSocketInput(
      playerId,
      connection,
      this.playerInputRequestRepository
    );
    const playerStats = stats ?? DefaultPlayerStats;

    const player = new ServerPlayer(
      playerInfo,
      playerState,
      view,
      new PlayerServerMovementValidator(connection),
      input,
      playerStats,
      this.mapManager,
      new ServerPlayerInventory(
        playerId,
        this.inventoryRepository,
        inventory?.items ?? [],
        playerStats.inventorySize
      ),
      new ServerBalance(playerId, this.balanceRepository, balance?.amount ?? 0),
      connection,
      this.playerInfoRepository,
      this.playerStateRepository,
      new PlayerTransportation(this.mapManager)
    );
    player.inventory.setItems(inventory?.items ?? []);
    player.balance.set(balance?.amount ?? 0);

    view.setEntityReference(player);

    this.collisionableTargetRepository.save(view.id, {
      target: player,
      type: CollisionableTargetType.PLAYER,
    });
    connection.setPlayerId(player.info.id);
    this.presenterProvider.forPlayer(view, player);

    return player;
  }
}
