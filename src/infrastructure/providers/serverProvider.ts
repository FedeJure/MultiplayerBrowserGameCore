import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { DependencyManager } from "../dependencyManager";
import { ConnectedPlayersRepository } from "../repositories/connectedPlayersRepository";
import { ConnectionsRepository } from "../repositories/connectionsRepository";
import { InMemoryPlayerRepository } from "../repositories/inMemoryPlayerRepository";
import { InMemoryPlayerStateRepository } from "../repositories/inMemoryPlayerStateRepository";
import { PlayerInfoRepository } from "../repositories/playerInfoRepository";
import { PlayerInputRequestRepository } from "../repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../repositories/playerStateRepository";
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
  public static get connectedPlayerRepository(): ConnectedPlayersRepository {
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
}
