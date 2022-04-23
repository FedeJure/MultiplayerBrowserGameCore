import { Scene } from "phaser";
import { GameScene } from "./GameScene";

export class ClientGameScene extends GameScene {
  constructor(private hudScene: Scene) {
    super();
  }

  create(): void {
    this.scene.launch(this.hudScene);
  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
