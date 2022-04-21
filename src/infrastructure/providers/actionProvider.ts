import { DependencyManager } from "../dependencyManager";
import { CreateClientPlayerAction } from "../../domain/actions/provideClientPlayer";
import { ClientProvider } from "./clientProvider";
import { ResolvePlayerMovementWithInputs } from "../../domain/actions/resolvePlayerMovementWithInput";

export class ActionProvider {
  public static get CreateClientPlayer() {
    return DependencyManager.GetOrInstantiate<CreateClientPlayerAction>(
      () =>
        new CreateClientPlayerAction(
          ClientProvider.presenterProvider,
          ClientProvider.playerStateRepository,
          ClientProvider.inGamePlayersRepository
        )
    );
  }

  public static get ResolvePlayerMovementWithInputs() {
    return DependencyManager.GetOrInstantiate<ResolvePlayerMovementWithInputs>(
      () => new ResolvePlayerMovementWithInputs()
    );
  }
}
