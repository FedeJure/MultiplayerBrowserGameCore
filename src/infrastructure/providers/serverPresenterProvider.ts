import { GameObjects } from "phaser";
import { PlayerCollisionDelegator } from "../../domain/collisions/playerCollisionDelegator";
import { Delegator } from "../../domain/delegator";
import { EnvironmentObject } from "../../domain/environmentObjects/environmentObject";
import { EnvironmentObjectVariant } from "../../domain/environmentObjects/environmentObjectVariant";
import { AnimatedDecorativeObjectDelegator } from "../../domain/environmentObjects/variants/AnimatedDecortaiveObjectDelegator";
import { PlayerStateUpdaterDelegator } from "../../domain/player/playerStateUpdaterDelegator";
import { ViewPresenter } from "../../presentation/viewPresenter";
import { EnemyUpdateDelegator } from "../../domain/enemies/enemyUpdateDelegator";
import { ControllablePlayer } from "../../domain/player/players/controllablePlayer";
import { Enemy } from "../../domain/enemies/enemy";
import { PhaserEntityView } from "../../view/entity/phaserEntityView";

export class ServerPresenterProvider {
  forPlayer(view: PhaserEntityView, player: ControllablePlayer): void {
    new ViewPresenter(view, [
      new PlayerCollisionDelegator(player),
      new PlayerStateUpdaterDelegator(player)
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
    new ViewPresenter(view, [new EnemyUpdateDelegator(enemy)]);
  }
}
