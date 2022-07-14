import { GameScene } from "./GameScene";

export class ServerGameScene extends GameScene {
  frameTime: number = 0;
  update(time: number, delta: number): void {
    this.frameTime += delta;
    if (this.frameTime > 33.35) {
      super.update(time, this.frameTime);
      this.frameTime = 0;
    }
  }
}
