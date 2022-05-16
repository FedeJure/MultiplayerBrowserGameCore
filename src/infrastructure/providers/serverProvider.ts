import { ClientConnection } from "../../domain/clientConnection";
import { AttackTarget } from "../../domain/combat/attackTarget";
import { BaseEnemy } from "../../domain/enemies/BaseEnemy";
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
import { PlayerInventoryDto } from "../dtos/playerInventoryDto";
import { InMemoryEnvironmentObjectRepository } from "../repositories/inMemoryEnvironmentObjectRepository";
import { InMemoryPlayerStateRepository } from "../repositories/inMemoryPlayerStateRepository";
import {
  InMemoryAsyncRepository,
  InMemoryRepository,
} from "../repositories/InMemoryRepository";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
import { SocketRoomManager } from "../SocketRoomManager";
import { ServerPresenterProvider } from "./serverPresenterProvider";

//This is necessary because the dependency manager not work with generics
class ClientConnectionRepository extends InMemoryRepository<ClientConnection> {}
class InGamePlayerRepository extends InMemoryRepository<ServerPlayer> {}
class PlayerInfoRepository extends InMemoryAsyncRepository<PlayerInfo> {}
class PlayerInventoryRepository extends InMemoryAsyncRepository<PlayerInventoryDto> {}
class ItemRepository extends InMemoryAsyncRepository<Item> {}
class PlayerStatsRepository extends InMemoryAsyncRepository<PlayerStats> {}
class AttackTargetRepository extends InMemoryRepository<AttackTarget> {}
class SpawnedEnemiesRepository extends InMemoryRepository<BaseEnemy> {}

export class ServerProvider {
  constructor(private mapConfig: MapConfiguration) {}
  public  get connectionsRepository(): SimpleRepository<ClientConnection> {
    return DependencyManager.GetOrInstantiate<
      SimpleRepository<ClientConnection>
    >(() => new ClientConnectionRepository());
  }
  public  get playerInfoRepository(): AsyncRepository<PlayerInfo> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerInfo>>(
      () => new PlayerInfoRepository()
    );
  }
  public  get playerStateRepository(): PlayerStateRepository {
    return DependencyManager.GetOrInstantiate<PlayerStateRepository>(
      () => new InMemoryPlayerStateRepository()
    );
  }
  public  get presenterProvider(): ServerPresenterProvider {
    return DependencyManager.GetOrInstantiate<ServerPresenterProvider>(
      () => new ServerPresenterProvider()
    );
  }

  public  get playerInputRequestRepository(): PlayerInputRequestRepository {
    return DependencyManager.GetOrInstantiate<PlayerInputRequestRepository>(
      () => new PlayerInputRequestRepository()
    );
  }

  public  get roomManager(): RoomManager {
    return DependencyManager.GetOrInstantiate<RoomManager>(
      () => new SocketRoomManager()
    );
  }

  public  get inventoryRepository(): AsyncRepository<PlayerInventoryDto> {
    return DependencyManager.GetOrInstantiate<
      AsyncRepository<PlayerInventoryDto>
    >(() => new PlayerInventoryRepository());
  }

  public  get itemsRepository(): AsyncRepository<Item> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<Item>>(
      () => new ItemRepository()
    );
  }

  public  get environmentObjectsRepository(): EnvironmentObjectRepository {
    return DependencyManager.GetOrInstantiate<EnvironmentObjectRepository>(
      () => new InMemoryEnvironmentObjectRepository()
    );
  }

  public  get inGamePlayerRepository(): SimpleRepository<ServerPlayer> {
    return DependencyManager.GetOrInstantiate<SimpleRepository<ServerPlayer>>(
      () => new InGamePlayerRepository()
    );
  }

  public  get attackTargetRepository(): SimpleRepository<AttackTarget> {
    return DependencyManager.GetOrInstantiate<SimpleRepository<AttackTarget>>(
      () => new AttackTargetRepository()
    );
  }

  public  get playerStatsRepository(): AsyncRepository<PlayerStats> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerStats>>(
      () => new PlayerStatsRepository()
    );
  }

  public  get mapMapanger(): MapManager {
    return DependencyManager.GetOrInstantiate<MapManager>(
      () => new CompleteMapManager(this.mapConfig ?? MapsConfiguration)
    )
  }

  public  get enemiesRepository(): SimpleRepository<BaseEnemy> {
    return DependencyManager.GetOrInstantiate<SpawnedEnemiesRepository>(
      () => new SpawnedEnemiesRepository()
    )
  }
}
