import { PlayerView } from "./playerView";
import { Scene } from "phaser";

export class ServerPlayerView extends PlayerView {
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
