import { Physics } from "phaser";
import { PlayerView } from "./playerView";
import { GameScene } from "./scenes/GameScene";

export class ClientPlayerView extends PlayerView {
  private readonly spine: SpineGameObject;
  constructor(
    scene: GameScene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    
    const spine = scene.add.spine(x, y, "hero", "idle", true);
    spine.setScale(0.05)
    spine.setSize(width, height)
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite

    super(viewAsSprite, x, y, height, width);
    this.spine = spine
  }
}
