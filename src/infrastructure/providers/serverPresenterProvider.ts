import { GameObjects } from "phaser";
import { Delegator } from "../../domain/delegator";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { AnimatedDecorativeObjectDelegator } from "../../domain/environmentObjects/variants/AnimatedDecortaiveObjectDelegator";
import { EntityStateUpdaterDelegator } from "../../domain/entity/entityUpdaterDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { ControllablePlayer } from "../../domain/player/players/controllablePlayer";
import { Enemy } from "../../domain/enemies/enemy";
import { PhaserEntityView } from "../../view/entity/phaserEntityView";

export class ServerPresenterProvider {
  forPlayer(view: PhaserEntityView, player: ControllablePlayer): void {
    new ViewPresenter(view, [
      new EntityStateUpdaterDelegator(player, view.scene)
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
  forEnemy(view: GameObjects.GameObject, enemy: Enemy) {
    new ViewPresenter(view, [new EntityStateUpdaterDelegator(enemy, view.scene)]);
  }
}
