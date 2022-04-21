import { GameObjects } from "phaser";
import { ServerPlayerAnimationDelegator } from "../../domain/animations/serverPlayerAnimationDelegator";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { Delegator } from "../../domain/delegator";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { AnimatedDecorativeObjectDelegator } from "../../domain/environmentObjects/variants/AnimatedDecortaiveObjectDelegator";
import { PlayerAngleFixDelegator } from "../../domain/movement/playerAngleFixDelegator";
import { Player2_0 } from "../../domain/player/player2.0";
import { PlayerInput } from "../../domain/player/playerInput";
import { ServerPlayerStateUpdaterDelegator } from "../../domain/player/serverPlayerStateUpdaterDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { ActionProvider } from "./actionProvider";
import { ServerProvider } from "./serverProvider";

export class ServerPresenterProvider {
  forPlayer(
    view: Phaser.GameObjects.GameObject,
    player: Player2_0,
    input: PlayerInput
  ): void {
    new ViewPresenter(view, [
      new PlayerCollisionDelegator(player),
      new ServerPlayerAnimationDelegator(player),
      new ServerPlayerStateUpdaterDelegator(
        player,
        input,
        ActionProvider.ResolvePlayerMovementWithInputs,
        ServerProvider.playerInputRequestRepository
      ),
      new PlayerAngleFixDelegator(player),
    ]);
  }
  forEnvironmentObject(
    object: EnvironmentObject,
    view: GameObjects.GameObject
  ) {
    const delegators: Delegator[] = [];
    switch (object.objectVariant) {
      case EnvironmentObjectVariant.decorative:
        delegators.push(new AnimatedDecorativeObjectDelegator(view));
        break;
    }
    new ViewPresenter(view, delegators);
  }
}
