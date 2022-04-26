import { Vector } from "matter";
import { Physics, Scene } from "phaser";
import { AnimationCode } from "../../domain/animations/animations";
import { PlayerIngameHud } from "./playerIngameHud";
import { PhaserPlayerView } from "./phaserPlayerView";

export class ClientPlayerView extends PhaserPlayerView {
  private readonly spine: SpineGameObject;
  private readonly hud: PlayerIngameHud;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    const spine = scene.add.spine(x, y, "hero", AnimationCode.IDLE, true);
    const currentSize: Vector = spine.getBounds().size;
    const factor = currentSize.y / height;
    spine.setDisplaySize(currentSize.x / factor + 10, height + 10);
    spine.setSize(width, height);
    spine.setOffset(0, 10);
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;
    super(viewAsSprite, x, y, height, width);

    this.hud = new PlayerIngameHud(scene, height, width);
    this.add(this.hud);
    this.spine = spine;
  }

  playAnimation(anim: string) {
    this.spine.setAnimation(0, anim, true, true)
  }

  setDisplayName(name: string): void {
    this.hud.setDisplayName(name)
  }
}
