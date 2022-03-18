import { ClientPresenterProvider } from "./clientPresenterProvider";
import { DependencyManager } from "../dependencyManager";
import { ConnectedPlayersRepository } from "../repositories/connectedPlayersRepository";
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

export class ClientProvider {
  private static _serverConnection: SocketServerConnection;
  private static _localPlayerRepository: LocalPlayerRepository;
  private static _originUrl: string;

  public static Init(
    serverConnection: SocketServerConnection,
    localPlayerRepository: LocalPlayerRepository,
    originUrl: string,
  ) {
    ClientProvider._serverConnection = serverConnection;
    ClientProvider._localPlayerRepository = localPlayerRepository;
    ClientProvider._originUrl = originUrl
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
  public static get connectedPlayers(): ConnectedPlayersRepository {
    return DependencyManager.GetOrInstantiate<ConnectedPlayersRepository>(
      () => new ConnectedPlayersRepository()
    );
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

  public static get originUrl(): string { return this._originUrl}
}
