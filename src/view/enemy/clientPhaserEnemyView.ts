import { Physics, Scene } from "phaser";
import { AnimationLayer, AnimationCode } from "../../domain/animations/animations";
import { EnemyAnimation } from "../../domain/enemies/EnemyAnimations";
import { AnimationDto, EmptyAnimations } from "../../domain/player/animations/AnimationDto";
import { Vector } from "../../domain/vector";
import { PhaserEnemyView } from "./phaserEnemyView";

export class ClientPhaserEnemyView extends PhaserEnemyView {
  private spine: SpineGameObject;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string,
    initialAnimation: EnemyAnimation
  ) {
    const spine = scene.add.spine(x, y, "hero", initialAnimation, true);
    const currentSize: Vector = spine.getBounds().size;
    const factor = currentSize.y / height;
    spine.setDisplaySize(currentSize.x / factor + 10, height + 10);
    spine.setSize(width, height);
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;

    super(viewAsSprite, x, y, height, width);
    this.spine = spine;
  }

  playAnimations(anims: AnimationDto[]): void {
    EmptyAnimations.map(
      (anim) => anims.find((a) => a.layer === anim.layer) ?? anim
    ).forEach((anim) =>
      this.playAnimation(anim.name, anim.layer, anim.loop, anim.duration)
    );
  }

  playAnimation(
    anim: string,
    layer: AnimationLayer,
    loop: boolean = true,
    duration?: number
  ) {
    if (duration) {
      const animation = this.spine.findAnimation(anim);
      if (animation) animation.duration = duration;
    }
    const currentAnim = this.spine.getCurrentAnimation(layer);

    if (
      anim === AnimationCode.EMPTY_ANIMATION &&
      currentAnim &&
      currentAnim.name !== anim
    )
      this.spine.setToSetupPose();

    if (anim === AnimationCode.EMPTY_ANIMATION) {
      this.spine.clearTrack(layer);
    } else {
      this.spine.setAnimation(layer, anim, loop, true);
    }
  }
}
