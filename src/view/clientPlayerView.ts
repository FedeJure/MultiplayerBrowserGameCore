import { Vector } from "matter";
import { Physics } from "phaser";
import { AnimationCode } from "../domain/animations/animations";
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
    const spine = scene.add.spine(x, y, "hero", AnimationCode.IDLE, true);
    const currentSize: Vector = spine.getBounds().size
    const factor = currentSize.y / height

    spine.setDisplaySize(currentSize.x / factor, height).refresh()
    spine.setSize(width, height)
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;
    super(viewAsSprite, x, y, height, width);
    this.spine = spine;
  }

  playAnimation(anim: string) {
    this.spine.setAnimation(0, anim, true, true);
  }
}
