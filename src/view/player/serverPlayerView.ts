import { PhaserPlayerView } from "./phaserPlayerView";
import { Scene } from "phaser";

export class ServerPlayerView extends PhaserPlayerView {
  private readonly spine: SpineGameObject;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    
    const sprite = scene.matter.add.sprite(x,y, "")
    super(sprite, x, y, height, width);
  }
}
