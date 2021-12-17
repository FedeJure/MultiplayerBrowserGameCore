import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { GameScene } from "./GameScene";

export class ClientGameScene extends GameScene {
  constructor(collisionDispatcher: CollisionsDispatcher) {
    super(collisionDispatcher);
  }

  create(): void {
    super.create();
    const background = this.add.image(1250, 300, "background");
    background.scaleY = 2;
    background.scaleX = 2;
    background.setDepth(-1);
    this.scene.launch("hud");
  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
