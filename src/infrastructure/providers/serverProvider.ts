import { ClientConnection } from "../../domain/clientConnection";
import { CollisionableEntity } from "../../domain/entity/CollisionableEntity";
import { Enemy } from "../../domain/enemies/enemy";
import { CompleteMapManager } from "../../domain/environment/completeMapManager";
import { MapConfiguration } from "../../domain/environment/mapConfiguration";
import { MapManager } from "../../domain/environment/mapManager";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";
import { Item } from "../../domain/items/item";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { ServerPlayer } from "../../domain/player/players/serverPlayer";
import { PlayerStats } from "../../domain/player/playerStats";
import { AsyncRepository, SimpleRepository } from "../../domain/repository";
import { RoomManager } from "../../domain/roomManager";
import { MapsConfiguration } from "../configuration/MapsConfiguration";
import { DependencyManager } from "../dependencyManager";
import { PlayerInventoryDto } from "../../domain/inventory/playerInventoryDto";
import { InMemoryEnvironmentObjectRepository } from "../repositories/inMemoryEnvironmentObjectRepository";
import { InMemoryRepository } from "../repositories/InMemoryRepository";
import { InMemoryAsyncRepository } from "../repositories/InMemoryAsyncRepository";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { SocketRoomManager } from "../SocketRoomManager";
import { ServerPresenterProvider } from "./serverPresenterProvider";
import { CollisionManager } from "../../domain/collisions/collisionManager";
import { LootConfiguration } from "../../domain/loot/lootConfiguration";
import { LootGenerator } from "../../domain/loot/lootGenerator";
import { Loot } from "../../domain/loot/loot";
import { EnemyModel } from "../../domain/enemies/enemyModel/enemyModel";
import { MongooseItemRepository } from "../repositories/mongoose/mongooseItemRepository";
import { PlayerBalance } from "../../domain/inventory/playerBalance";
import { MongoosePlayerInfoRepository } from "../repositories/mongoose/MongoosePlayerInfoRepository";
import { MongoosePlayerInventoryRepository } from "../repositories/mongoose/MongoosePlayerInventoryRepository";
import { MongoosePlayerStatsRepository } from "../repositories/mongoose/MongoosePlayerStatsRepository";
import { MongooseLootConfigurationRepository } from "../repositories/mongoose/MongooseLootConfigurationRepository";
import { MongoosePlayerBalanceRepository } from "../repositories/mongoose/MongoosePlayerBalanceRepository";
import { MongooseEnemiesModelRepository } from "../repositories/mongoose/MongooseEnemiesModelRepository";
import { Account } from "../../domain/account/account";
import { MongooseAccountRepository } from "../repositories/mongoose/MongooseAccountRepository";
import { PlayerState } from "../../domain/player/playerState";
import { MongoosePlayerStateRepository } from "../repositories/mongoose/MongoosePlayerStateRepository";
import { PlayerRoomChangeEvent } from "../../domain/player/playerRoomChangeEvent";
import { InMemoryPlayerRoomChangeEventsRepository } from "../repositories/inMemoryPlayerRoomChangeEventsRepository";
import { MongoosePlayerRoomChangeRepository } from "../repositories/mongoose/MongooseRoomChangeEvent";
import { PlayerRoomChangeEventRepository } from "../../domain/player/playerRoomChangeEventRepository";
import { EnemyState } from "../../domain/enemies/EnemyState";
import { MongooseEnemiesStatesRepository } from "../repositories/mongoose/MongooseEnemyRepository";

//This is necessary because the dependency manager not work with generics

class ClientConnectionRepository extends InMemoryRepository<ClientConnection> {}
class InGamePlayerRepository extends InMemoryRepository<ServerPlayer> {}
class AttackTargetRepository extends InMemoryRepository<CollisionableEntity> {}
class SpawnedEnemiesRepository extends InMemoryRepository<Enemy> {}
class LootRepository extends InMemoryRepository<Loot> {}

class PlayerInfoRepository extends InMemoryAsyncRepository<PlayerInfo> {}
class PlayerInventoryRepository extends InMemoryAsyncRepository<PlayerInventoryDto> {}
class PlayerBalanceRepository extends InMemoryAsyncRepository<PlayerBalance> {}
class PlayerStatsRepository extends InMemoryAsyncRepository<PlayerStats> {}
class LootConfigurationRepository extends InMemoryAsyncRepository<LootConfiguration> {}
class EnemiesModelRepository extends InMemoryAsyncRepository<EnemyModel> {}
class ItemRepository extends InMemoryAsyncRepository<Item> {}
class AccountsRepository extends InMemoryAsyncRepository<Account> {}
class PlayerStatesRepository extends InMemoryAsyncRepository<PlayerState> {}
class EnemyStatesRepository extends InMemoryAsyncRepository<EnemyState> {}

export class ServerProvider {
  constructor(
    private mapConfig: MapConfiguration,
    private useInMemory: boolean = false
  ) {}
  public get connectionsRepository(): SimpleRepository<ClientConnection> {
    return DependencyManager.GetOrInstantiate<
      SimpleRepository<ClientConnection>
    >(() => new ClientConnectionRepository());
  }

  public get playerStateRepository(): AsyncRepository<PlayerState> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerState>>(
      () =>
        this.useInMemory
          ? new PlayerStatesRepository()
          : new MongoosePlayerStateRepository()
    );
  }
  public get presenterProvider(): ServerPresenterProvider {
    return DependencyManager.GetOrInstantiate<ServerPresenterProvider>(
      () => new ServerPresenterProvider()
    );
  }

  public get playerInputRequestRepository(): PlayerInputRequestRepository {
    return DependencyManager.GetOrInstantiate<PlayerInputRequestRepository>(
      () => new PlayerInputRequestRepository()
    );
  }

  public get roomManager(): RoomManager {
    return DependencyManager.GetOrInstantiate<RoomManager>(
      () => new SocketRoomManager()
    );
  }

  public get environmentObjectsRepository(): EnvironmentObjectRepository {
    return DependencyManager.GetOrInstantiate<EnvironmentObjectRepository>(
      () => new InMemoryEnvironmentObjectRepository()
    );
  }

  public get inGamePlayerRepository(): SimpleRepository<ServerPlayer> {
    return DependencyManager.GetOrInstantiate<SimpleRepository<ServerPlayer>>(
      () => new InGamePlayerRepository()
    );
  }

  public get collisionableTargetRepository(): SimpleRepository<CollisionableEntity> {
    return DependencyManager.GetOrInstantiate<
      SimpleRepository<CollisionableEntity>
    >(() => new AttackTargetRepository());
  }

  public get mapMapanger(): MapManager {
    return DependencyManager.GetOrInstantiate<MapManager>(
      () => new CompleteMapManager(this.mapConfig ?? MapsConfiguration)
    );
  }

  public get enemiesRepository(): SimpleRepository<Enemy> {
    return DependencyManager.GetOrInstantiate<SpawnedEnemiesRepository>(
      () => new SpawnedEnemiesRepository()
    );
  }

  public get enemiesStatesRepository(): AsyncRepository<EnemyState> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<EnemyState>>(() =>
      this.useInMemory
        ? new EnemyStatesRepository()
        : new MongooseEnemiesStatesRepository()
    );
  }

  private _collisionManager: CollisionManager;

  public setCollisionManager(collisionManager: CollisionManager) {
    this._collisionManager = collisionManager;
  }

  public get collisionManager(): CollisionManager {
    return this._collisionManager;
  }

  public get lootGenerator(): LootGenerator {
    return DependencyManager.GetOrInstantiate<LootGenerator>(
      () => new LootGenerator(this.lootRepository)
    );
  }

  public get lootRepository(): LootRepository {
    return DependencyManager.GetOrInstantiate<LootRepository>(
      () => new LootRepository()
    );
  }

  public get playerBalanceRepository(): AsyncRepository<PlayerBalance> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerBalance>>(
      () =>
        this.useInMemory
          ? new PlayerBalanceRepository()
          : new MongoosePlayerBalanceRepository()
    );
  }

  public get enemiesModelRepository(): AsyncRepository<EnemyModel> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<EnemyModel>>(() =>
      this.useInMemory
        ? new EnemiesModelRepository()
        : new MongooseEnemiesModelRepository()
    );
  }

  public get accountRepository(): AsyncRepository<Account> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<Account>>(() =>
      this.useInMemory
        ? new AccountsRepository()
        : new MongooseAccountRepository()
    );
  }

  public get lootConfigurationRepository(): AsyncRepository<LootConfiguration> {
    return DependencyManager.GetOrInstantiate<
      AsyncRepository<LootConfiguration>
    >(() =>
      this.useInMemory
        ? new LootConfigurationRepository()
        : new MongooseLootConfigurationRepository()
    );
  }

  public get playerStatsRepository(): AsyncRepository<PlayerStats> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerStats>>(
      () =>
        this.useInMemory
          ? new PlayerStatsRepository()
          : new MongoosePlayerStatsRepository()
    );
  }
  public get itemsRepository(): AsyncRepository<Item> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<Item>>(() =>
      this.useInMemory ? new ItemRepository() : new MongooseItemRepository()
    );
  }
  public get inventoryRepository(): AsyncRepository<PlayerInventoryDto> {
    return DependencyManager.GetOrInstantiate<
      AsyncRepository<PlayerInventoryDto>
    >(() =>
      this.useInMemory
        ? new PlayerInventoryRepository()
        : new MongoosePlayerInventoryRepository()
    );
  }

  public get playerInfoRepository(): AsyncRepository<PlayerInfo> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerInfo>>(() =>
      this.useInMemory
        ? new PlayerInfoRepository()
        : new MongoosePlayerInfoRepository()
    );
  }

  public get playerRoomChangeEventRepository(): PlayerRoomChangeEventRepository {
    return DependencyManager.GetOrInstantiate<PlayerRoomChangeEventRepository>(
      () =>
        this.useInMemory
          ? new InMemoryPlayerRoomChangeEventsRepository()
          : new MongoosePlayerRoomChangeRepository()
    );
  }
}
