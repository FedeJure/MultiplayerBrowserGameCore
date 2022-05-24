import { ClientPresenterProvider } from "./clientPresenterProvider";
import { DependencyManager } from "../dependencyManager";
import { LocalPlayerRepository } from "../repositories/localPlayerRepository";
import { SocketServerConnection } from "../socketServerConnection";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
import { InMemoryPlayerStateRepository } from "../repositories/inMemoryPlayerStateRepository";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { Scene } from "phaser";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";
import { RemoteEnvironmentObjectRepository } from "../repositories/remoteEnvironmentObjectRepository";
import { ControllablePlayer } from "../../domain/player/players/controllablePlayer";
import { SimpleRepository } from "../../domain/repository";
import { InMemoryRepository } from "../repositories/InMemoryRepository";
import { Item } from "../../domain/items/item";
import { PlayerInventoryDto } from "../dtos/playerInventoryDto";
import { CollisionableEntity } from "../../domain/entity/CollisionableEntity";
import { MapManager } from "../../domain/environment/mapManager";
import { Enemy } from "../../domain/enemies/enemy";
import { CollisionManager } from "../../domain/collisions/collisionManager";

//This is necessary because the dependency manager not work with generics
class InventoryRepository extends InMemoryRepository<PlayerInventoryDto> {}
class ItemRepository extends InMemoryRepository<Item> {}
class AttackTargetRepository extends InMemoryRepository<CollisionableEntity> {}
class SpawnedEnemiesRepository extends InMemoryRepository<Enemy> {}

export class ClientProvider {
  private static _serverConnection: SocketServerConnection;
  private static _localPlayerRepository: LocalPlayerRepository;
  private static _originUrl: string;
  private static _hudScene: Scene;
  private static _collisionManager: CollisionManager;

  public static Init(
    serverConnection: SocketServerConnection,
    localPlayerRepository: LocalPlayerRepository,
    originUrl: string,
    hudScene: Scene
  ) {
    ClientProvider._serverConnection = serverConnection;
    ClientProvider._localPlayerRepository = localPlayerRepository;
    ClientProvider._originUrl = originUrl;
    ClientProvider._hudScene = hudScene;
  }

  public static setCollisionManager(collisionManager: CollisionManager) {
    ClientProvider._collisionManager = collisionManager;
  }

  public static get playerStateRepository(): PlayerStateRepository {
    return DependencyManager.GetOrInstantiate<PlayerStateRepository>(
      () => new InMemoryPlayerStateRepository()
    );
  }

  public static get presenterProvider(): ClientPresenterProvider {
    return DependencyManager.GetOrInstantiate<ClientPresenterProvider>(
      () => new ClientPresenterProvider()
    );
  }
  public static get serverConnection(): SocketServerConnection {
    return ClientProvider._serverConnection;
  }
  public static get localPlayerRepository(): LocalPlayerRepository {
    return ClientProvider._localPlayerRepository;
  }

  public static get playerInputRequestRepository(): PlayerInputRequestRepository {
    return DependencyManager.GetOrInstantiate<PlayerInputRequestRepository>(
      () => new PlayerInputRequestRepository()
    );
  }

  public static get inventoryRepository(): SimpleRepository<PlayerInventoryDto> {
    return DependencyManager.GetOrInstantiate<
      SimpleRepository<PlayerInventoryDto>
    >(() => new InventoryRepository());
  }

  public static get itemsRepository(): SimpleRepository<Item> {
    return DependencyManager.GetOrInstantiate<SimpleRepository<Item>>(
      () => new ItemRepository()
    );
  }

  public static get environmentObjectRepository(): EnvironmentObjectRepository {
    return DependencyManager.GetOrInstantiate<EnvironmentObjectRepository>(
      () => new RemoteEnvironmentObjectRepository(this.serverConnection)
    );
  }

  public static get inGamePlayersRepository(): SimpleRepository<ControllablePlayer> {
    return DependencyManager.GetOrInstantiate<
      SimpleRepository<ControllablePlayer>
    >(() => new InMemoryRepository<ControllablePlayer>());
  }

  public static get collisionableTargetRepository(): SimpleRepository<CollisionableEntity> {
    return DependencyManager.GetOrInstantiate<
      SimpleRepository<CollisionableEntity>
    >(() => new AttackTargetRepository());
  }

  public static get originUrl(): string {
    return this._originUrl;
  }

  public static get mapManager(): MapManager {
    return DependencyManager.GetOrInstantiate<MapManager>(
      () => new MapManager()
    );
  }

  public static get spawnedEnemies(): SimpleRepository<Enemy> {
    return DependencyManager.GetOrInstantiate<SimpleRepository<Enemy>>(
      () => new SpawnedEnemiesRepository()
    );
  }

  public static get collisionManager(): CollisionManager {
    return this._collisionManager;
  }
}
