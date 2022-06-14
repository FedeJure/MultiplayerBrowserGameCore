import { Scene } from "phaser";
import { GameScene } from "./GameScene";

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

      console.log("safsadfsd")
    })
    
    this.scene.launch(this.hudScene);

  }
  update(time: number, delta: number): void {
    super.update(time, delta);
  }

}
