import { Scene, Physics } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { SceneNames } from "./SceneNames";

export class GameScene extends Scene {
  constructor(protected collisionDispatcher: CollisionsDispatcher) {
    super({
      key: SceneNames.MainScene,
    });
    this.collisionDispatcher = collisionDispatcher;
  }

  create() {
    this.initCollisions();
  }

  initCollisions() {
    this.matter.world.addListener(
      "collisionactive",
      (ev: Physics.Matter.Events.CollisionStartEvent) => {
        this.collisionDispatcher.sendCollisionStart(ev);
      },
      this
    );

    this.matter.world.addListener(
      "collisionend",
      (ev: Physics.Matter.Events.CollisionEndEvent) => {
        this.collisionDispatcher.sendCollisionEnd(ev);
      },
      this
    );
  }
}
