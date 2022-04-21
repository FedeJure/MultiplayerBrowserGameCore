import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";
import { InventoryRepository } from "../../domain/items/inventoryRepository";
import { ItemsRepository } from "../../domain/items/itemsRepository";
import { InGamePlayersRepository } from "../../domain/player/inGamePlayersRepository";
import { RoomManager } from "../../domain/roomManager";
import { DependencyManager } from "../dependencyManager";
import { ConnectionsRepository } from "../repositories/connectionsRepository";
import { InMemoryEnvironmentObjectRepository } from "../repositories/inMemoryEnvironmentObjectRepository";
import { InMemoryInGamePlayerRepository } from "../repositories/inMemoryInGamePlayerRepository";
import { InMemoryInventoryRepository } from "../repositories/inMemoryInventoryRepository";
import { InMemoryItemsRepository } from "../repositories/inMemoryItemRepository";
import { InMemoryPlayerRepository } from "../repositories/inMemoryPlayerRepository";
import { InMemoryPlayerStateRepository } from "../repositories/inMemoryPlayerStateRepository";
import { PlayerInfoRepository } from "../repositories/playerInfoRepository";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
import { SocketRoomManager } from "../SocketRoomManager";
import { ServerPresenterProvider } from "./serverPresenterProvider";

export class ServerProvider {
  public static get connectionsRepository(): ConnectionsRepository {
    return DependencyManager.GetOrInstantiate<ConnectionsRepository>(
      () => new ConnectionsRepository()
    );
  }
  public static get playerInfoRepository(): PlayerInfoRepository {
    return DependencyManager.GetOrInstantiate<PlayerInfoRepository>(
      () => new InMemoryPlayerRepository()
    );
  }
  public static get playerStateRepository(): PlayerStateRepository {
    return DependencyManager.GetOrInstantiate<PlayerStateRepository>(
      () => new InMemoryPlayerStateRepository()
    );
  }
  public static get presenterProvider(): ServerPresenterProvider {
    return DependencyManager.GetOrInstantiate<ServerPresenterProvider>(
      () => new ServerPresenterProvider()
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

  public static get roomManager(): RoomManager {
    return DependencyManager.GetOrInstantiate<RoomManager>(
      () => new SocketRoomManager(this.inGamePlayerRepository)
    );
  }

  public static get inventoryRepository(): InventoryRepository {
    return DependencyManager.GetOrInstantiate<InMemoryInventoryRepository>(
      () => new InMemoryInventoryRepository()
    );
  }

  public static get itemsRepository(): ItemsRepository {
    return DependencyManager.GetOrInstantiate<ItemsRepository>(
      () => new InMemoryItemsRepository()
    )
  }

  public static get environmentObjectsRepository(): EnvironmentObjectRepository {
    return DependencyManager.GetOrInstantiate<EnvironmentObjectRepository>(
      () => new InMemoryEnvironmentObjectRepository()
    )
  }

  public static get inGamePlayerRepository(): InGamePlayersRepository {
    return DependencyManager.GetOrInstantiate<InGamePlayersRepository>(
      () => new InMemoryInGamePlayerRepository()
    )
  }
}
