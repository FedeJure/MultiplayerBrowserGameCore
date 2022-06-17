import { Scene } from "phaser";
import { GameScene } from "./GameScene";
import { SceneNames } from "./SceneNames";

export class ClientGameScene extends GameScene {
  constructor(private hudScene: Scene) {
    super();
  }

  create(): void {
    // this.game.canvas.style.width = "100%"
    // this.game.canvas.style.height = "100%"
    window.addEventListener('resize', () => {
      // this.scale.displaySize.setAspectRatio( window.screen.width/window.screen.height );
      // this.game.canvas.style.width = "100%"
      // this.game.canvas.style.height = "100%"
      // this.scale.refresh();
      })
    
    this.scene.launch(this.hudScene);
    this.scene.launch(SceneNames.BackgroundScene);
    this.scene.moveDown(SceneNames.BackgroundScene)
    this.scene.moveDown(SceneNames.BackgroundScene)

  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
