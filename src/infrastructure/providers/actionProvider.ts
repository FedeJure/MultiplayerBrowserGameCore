import { DependencyManager } from "../dependencyManager";
import { CreateClientPlayerAction } from "../../domain/actions/provideClientPlayer";
import { ClientProvider } from "./clientProvider";
import { CreateLocalClientPlayer } from "../../domain/actions/provideLocalClientPlayer";
import { CreatePlayerFromId } from "../../domain/actions/providePlayerFromId";
import { ServerProvider } from "./serverProvider";
import { ResolvePlayerMovementWithInputs } from "../../domain/actions/resolvePlayerMovementWithInput";

export class ActionProvider {
  public static get CreateClientPlayer() {
    return DependencyManager.GetOrInstantiate<CreateClientPlayerAction>(
      () =>
        new CreateClientPlayerAction(
          ClientProvider.presenterProvider,
          ClientProvider.connectedPlayers,
          ClientProvider.playerStateRepository
        )
    );
  }

  public static get CreateLocalClientPlayer() {
    return DependencyManager.GetOrInstantiate<CreateLocalClientPlayer>(
      () =>
        new CreateLocalClientPlayer(
          ClientProvider.presenterProvider,
          ClientProvider.connectedPlayers,
          ClientProvider.playerStateRepository
        )
    );
  }

  public static get CreatePlayerFromId() {
    return DependencyManager.GetOrInstantiate<CreatePlayerFromId>(
      () =>
        new CreatePlayerFromId(
          ServerProvider.playerInfoRepository,
          ServerProvider.playerStateRepository,
          ServerProvider.presenterProvider,
          ServerProvider.connectedPlayerRepository,
          ServerProvider.inventoryRepository
        )
    );
  }

  public static get ResolvePlayerMovementWithInputs() {
    return DependencyManager.GetOrInstantiate<ResolvePlayerMovementWithInputs>(
      () => new ResolvePlayerMovementWithInputs()
    );
  }
}
