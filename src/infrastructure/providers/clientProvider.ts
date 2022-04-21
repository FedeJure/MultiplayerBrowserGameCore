import { ClientPresenterProvider } from "./clientPresenterProvider";
import { DependencyManager } from "../dependencyManager";
import { LocalPlayerRepository } from "../repositories/localPlayerRepository";
import { SocketServerConnection } from "../socketServerConnection";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
import { InMemoryPlayerStateRepository } from "../repositories/inMemoryPlayerStateRepository";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { InventoryRepository } from "../../domain/items/inventoryRepository";
import { InMemoryInventoryRepository } from "../repositories/inMemoryInventoryRepository";
import { ItemsRepository } from "../../domain/items/itemsRepository";
import { InMemoryItemsRepository } from "../repositories/inMemoryItemRepository";
import { Scene } from "phaser";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";
import { RemoteEnvironmentObjectRepository } from "../repositories/remoteEnvironmentObjectRepository";
import { InGamePlayersRepository } from "../../domain/player/playersRepository2.0";
import { InMemoryInGamePlayerRepository } from "../repositories/inGamePlayerRepository";

export class ClientProvider {
  private static _serverConnection: SocketServerConnection;
  private static _localPlayerRepository: LocalPlayerRepository;
  private static _originUrl: string;
  private static _hudScene: Scene;

  public static Init(
    serverConnection: SocketServerConnection,
    localPlayerRepository: LocalPlayerRepository,
    originUrl: string,
    hudScene: Scene
  ) {
    ClientProvider._serverConnection = serverConnection;
    ClientProvider._localPlayerRepository = localPlayerRepository;
    ClientProvider._originUrl = originUrl
    ClientProvider._hudScene = hudScene
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

  public static get collisionsDispatcher(): CollisionsDispatcher {
    return DependencyManager.GetOrInstantiate<CollisionsDispatcher>(
      () => new CollisionsDispatcher()
    );
  }
  public static get playerInputRequestRepository(): PlayerInputRequestRepository {
    return DependencyManager.GetOrInstantiate<PlayerInputRequestRepository>(
      () => new PlayerInputRequestRepository()
    );
  }

  public static get inventoryRepository(): InventoryRepository {
    return DependencyManager.GetOrInstantiate<InventoryRepository>(
      () => new InMemoryInventoryRepository()
    )
  }

  public static get itemsRepository(): ItemsRepository {
    return DependencyManager.GetOrInstantiate<ItemsRepository>(
      () => new InMemoryItemsRepository()
    )
  }

  public static get environmentObjectRepository(): EnvironmentObjectRepository {
    return DependencyManager.GetOrInstantiate<EnvironmentObjectRepository>(
      () => new RemoteEnvironmentObjectRepository(this.serverConnection)
    )
  }

  public static get inGamePlayersRepository(): InGamePlayersRepository {
    return DependencyManager.GetOrInstantiate<InGamePlayersRepository>(
      () => new InMemoryInGamePlayerRepository()
    )
  }

  public static get originUrl(): string { return this._originUrl}
}
