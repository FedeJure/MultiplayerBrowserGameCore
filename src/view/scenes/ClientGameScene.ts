import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { GameScene } from "./GameScene";

export class ClientGameScene extends GameScene {
  constructor(collisionDispatcher: CollisionsDispatcher) {
    super(collisionDispatcher);
  }

  create(): void {
    super.create();
    this.scene.launch("hud");
  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
