import { GameObjects } from "phaser";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { Delegator } from "../../domain/delegator";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { AnimatedDecorativeObjectDelegator } from "../../domain/environmentObjects/variants/AnimatedDecortaiveObjectDelegator";
import { PlayerAngleFixDelegator } from "../../domain/player/movement/playerAngleFixDelegator";
import { PlayerInput } from "../../domain/player/playerInput";
import { ServerPlayerStateUpdaterDelegator } from "../../domain/player/serverPlayerStateUpdaterDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { Player } from "../../domain/player/players/player";

export class ServerPresenterProvider {
  forPlayer(
    view: Phaser.GameObjects.GameObject,
    player: Player,
    input: PlayerInput
  ): void {
    new ViewPresenter(view, [
      new PlayerCollisionDelegator(player),
      new ServerPlayerStateUpdaterDelegator(player, input),
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
