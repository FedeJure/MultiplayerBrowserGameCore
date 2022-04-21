import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { EnvironmentObjectRepository } from "../../domain/environmentObjects/environmentObjectRepository";
import { Item } from "../../domain/items/item";
import { InGamePlayersRepository } from "../../domain/player/inGamePlayersRepository";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { ServerPlayer } from "../../domain/player/serverPlayer";
import { AsyncRepository } from "../../domain/repository";
import { RoomManager } from "../../domain/roomManager";
import { DependencyManager } from "../dependencyManager";
import { PlayerInventoryDto } from "../dtos/playerInventoryDto";
import { ConnectionsRepository } from "../repositories/connectionsRepository";
import { InMemoryEnvironmentObjectRepository } from "../repositories/inMemoryEnvironmentObjectRepository";
import { InMemoryInGameServerPlayerRepository } from "../repositories/inMemoryInGamePlayerRepository";
import { InMemoryPlayerStateRepository } from "../repositories/inMemoryPlayerStateRepository";
import { InMemoryAsyncRepository } from "../repositories/InMemoryRepository";
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
  public static get playerInfoRepository(): AsyncRepository<PlayerInfo> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerInfo>>(
      () => new InMemoryAsyncRepository<PlayerInfo>()
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

  public static get inventoryRepository(): AsyncRepository<PlayerInventoryDto> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<PlayerInventoryDto>>(
      () => new InMemoryAsyncRepository<PlayerInventoryDto>()
    );
  }

  public static get itemsRepository(): AsyncRepository<Item> {
    return DependencyManager.GetOrInstantiate<AsyncRepository<Item>>(
      () => new InMemoryAsyncRepository<Item>()
    )
  }

  public static get environmentObjectsRepository(): EnvironmentObjectRepository {
    return DependencyManager.GetOrInstantiate<EnvironmentObjectRepository>(
      () => new InMemoryEnvironmentObjectRepository()
    )
  }

  public static get inGamePlayerRepository(): InGamePlayersRepository<ServerPlayer> {
    return DependencyManager.GetOrInstantiate<InGamePlayersRepository<ServerPlayer>>(
      () => new InMemoryInGameServerPlayerRepository()
    )
  }
}
