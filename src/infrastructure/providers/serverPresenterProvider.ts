import { ServerPlayerAnimationDelegator } from "../../domain/animations/serverPlayerAnimationDelegator";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { Player } from "../../domain/player/player";
import { PlayerInput } from "../../domain/player/playerInput";
import { ServerPlayerPresenter } from "../../presentation/serverPlayerPresenter";
import { ActionProvider } from "./actionProvider";
import { ServerProvider } from "./serverProvider";

export class ServerPresenterProvider {
  forPlayer(
    player:Player,
    input: PlayerInput
  ): void {
    new ServerPlayerPresenter(
      player,
      input,
      ActionProvider.ResolvePlayerMovementWithInputs,
      ServerProvider.playerStateRepository,
      [
        new PlayerCollisionDelegator(
          player,
          ServerProvider.collisionsDispatcher,
          ServerProvider.playerStateRepository
        ),
        new ServerPlayerAnimationDelegator(
          player,
          ServerProvider.playerStateRepository
        ),
      ],
      ServerProvider.playerInputRequestRepository
    );
  }
}
