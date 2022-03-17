import { Scene } from "phaser";
import { CollisionsDispatcher } from "../../domain/collisions/collisionsDispatcher";
import { GameScene } from "./GameScene";

export class ClientGameScene extends GameScene {
  constructor(collisionDispatcher: CollisionsDispatcher, private hudScene: Scene) {
    super(collisionDispatcher);
  }

  create(): void {
    super.create();
    this.scene.launch(this.hudScene);
  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
