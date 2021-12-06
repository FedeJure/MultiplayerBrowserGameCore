import { PlayerView } from "./playerView";
import { GameScene } from "./scenes/GameScene";

export class ServerPlayerView extends PlayerView {
  private readonly spine: SpineGameObject;
  constructor(
    scene: GameScene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    
    const sprite = scene.matter.add.sprite(x,y, "")
    super(sprite, x, y, height, width);
  }
}
