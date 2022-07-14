import { Scene } from "phaser";
import { GameScene } from "./GameScene";
import { SceneNames } from "./SceneNames";

export class ClientGameScene extends GameScene {
  frameTime: number = 0;
  constructor(private hudScene: Scene) {
    super();
  }

  create(): void {
    this.scene.launch(this.hudScene);
    this.scene.launch(SceneNames.BackgroundScene);
    this.scene.moveDown(SceneNames.BackgroundScene);
    this.scene.moveDown(SceneNames.BackgroundScene);
    document.body.requestFullscreen();
  }
  update(time: number, delta: number): void {
    this.frameTime += delta;
    if (this.frameTime > 16.5) {
      super.update(time, this.frameTime);
      this.frameTime = 0;
      this.game.canvas.style.margin = "0px";
    }
  }
}
