import { ServerPlayerAnimationDelegator } from "../../domain/animations/serverPlayerAnimationDelegator";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { Player } from "../../domain/player/player";
import { PlayerInput } from "../../domain/player/playerInput";
import { ServerPlayerStateUpdaterDelegator } from "../../domain/player/serverPlayerStateUpdaterDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { ActionProvider } from "./actionProvider";
import { ServerProvider } from "./serverProvider";

export class ServerPresenterProvider {
  forPlayer(
    view: Phaser.GameObjects.GameObject,
    player: Player,
    input: PlayerInput
  ): void {
    new ViewPresenter(view, [
      new PlayerCollisionDelegator(
        player,
        ServerProvider.playerStateRepository
      ),
      new ServerPlayerAnimationDelegator(
        player,
        ServerProvider.playerStateRepository
      ),
      new ServerPlayerStateUpdaterDelegator(
        player,
        input,
        ActionProvider.ResolvePlayerMovementWithInputs,
        ServerProvider.playerStateRepository,
        ServerProvider.playerInputRequestRepository
      ),
    ]);
  }
}
