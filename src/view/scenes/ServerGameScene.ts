import { GameScene } from "./GameScene";

export class ServerGameScene extends GameScene {
  frameTime: number = 0;
  create() {
    this.physics.world.setFPS(30)
    console.log("FPS:", this.physics.world.fps)

  }
  update(time: number, delta: number): void {
    this.frameTime += delta;
    if (this.frameTime > 33.35) {
      super.update(time, this.frameTime);
      this.frameTime = 0;
    }
  }
}
