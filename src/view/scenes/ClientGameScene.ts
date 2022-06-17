import { Scene } from "phaser";
import { GameScene } from "./GameScene";
import { SceneNames } from "./SceneNames";

export class ClientGameScene extends GameScene {
  constructor(private hudScene: Scene) {
    super();
  }

  create(): void {
  
    this.scene.launch(this.hudScene);
    this.scene.launch(SceneNames.BackgroundScene);
    this.scene.moveDown(SceneNames.BackgroundScene)
    this.scene.moveDown(SceneNames.BackgroundScene)

  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
