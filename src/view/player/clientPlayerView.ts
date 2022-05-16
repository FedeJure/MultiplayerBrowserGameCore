import { Vector } from "matter";
import { Physics, Scene } from "phaser";
import {
  AnimationCode,
  AnimationLayer,
} from "../../domain/animations/animations";
import { PlayerIngameHud } from "./playerIngameHud";
import { PhaserPlayerView } from "./phaserPlayerView";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";
import {
  AnimationDto,
  EmptyAnimations,
} from "../../domain/player/animations/AnimationDto";

export class ClientPlayerView extends PhaserPlayerView {
  private readonly spine: SpineGameObject;
  private readonly hud: PlayerIngameHud;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    const spine = scene.add.spine(x, y, "hero", AnimationCode.IDLE, true);
    const currentSize: Vector = spine.getBounds().size;
    const factor = currentSize.y / height;
    spine.setDisplaySize(currentSize.x / factor + 10, height + 10);
    spine.setSize(width, height);
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;
    super(viewAsSprite, x, y, height, width, combatCollisionResolver);

    this.hud = new PlayerIngameHud(scene, height, width);
    this.add(this.hud);
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

  setDisplayName(name: string): void {
    this.hud.setDisplayName(name);
  }

  setLifePercent(percent: number): void {
    this.hud.setLifePercent(percent);
  }
}
