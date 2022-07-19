import { GameObjects, Scene } from "phaser";
import {
  AnimationLayer,
  EntityAnimationCode,
} from "../../domain/entity/animations";
import {
  AnimationDto,
} from "../../domain/entity/AnimationDto";
import { EntityIngameHud } from "./entityIngameHud";
import { PhaserEntityView } from "./phaserEntityView";

export class SpinePhaserEntityView extends PhaserEntityView {
  protected spine: SpineGameObject;
  protected hud: EntityIngameHud;
  private lastAnimationsByLayer: Map<AnimationLayer, AnimationDto>;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string,
    texture: string = "hero"
  ) {
    const spine = scene.add.spine(x, y, texture, undefined, true);

    spine.setScale(height / spine.height);
    super(spine, x, y, height, width);
    this.setName(name);
    this.spine = spine;
    // this.spine.state.addListener({
    //   event: (track, eventt) => {
    //     console.log(track, eventt);
    //   },
    //   start: () => {},
    //   interrupt: () => {},
    //   end: () => {},
    //   dispose: () => {},
    //   complete: () => {},
    // });
    this.spine.on("complete", (ev: spine.TrackEntry, s: any) => {
      this.spine.clearTrack(ev.trackIndex)
    });
    const tween = scene.tweens.add({
      targets: spine,
      x: 400,
      y: 300,
      ease: Phaser.Math.Easing.Sine.Out,
      duration: 100,
      paused: true,
      repeat: -1,
      useFrames: false,
      loop: true,
    });
    tween.play();
    this.scene.events.addListener(
      Phaser.Scenes.Events.UPDATE,
      (time, delta) => {
        if (tween.isPlaying()) {

          tween.updateTo("x", this.x, true);
          tween.updateTo("y", this.y + height / 6, true);
        }
      }
    );

    this.lastAnimationsByLayer = new Map();
  }

  override playAnimations(anims: AnimationDto[]): void {
    anims.forEach((anim) => {
      this.playAnimation(
        anim.name,
        anim.layer,
        anim.loop,
        anim.time,
        anim.duration
      );
    });
    // EmptyAnimations.map(
    //   (anim) => anims.find((a) => a.layer === anim.layer) ?? anim
    // ).forEach((anim) => {
    // if (anim.layer === AnimationLayer.COMBAT) console.log(anim)

    //   this.playAnimation(
    //     anim.name,
    //     anim.layer,
    //     anim.loop,
    //     anim.time,
    //     anim.duration
    //   );
    //   if (anim.name !== EntityAnimationCode.EMPTY_ANIMATION)
    //     this.lastAnimationsByLayer.set(anim.layer, anim);
    // });
  }

  override setLifePercent(percent: number): void {
    this.hud.setLifePercent(percent);
  }

  override setLevel(level: number): void {
    this.hud.setLevel(level);
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene);
    this.spine.destroy(fromScene);
  }

  die(): void {
    this.playAnimation(
      EntityAnimationCode.DIE,
      AnimationLayer.COMBAT,
      false,
      Date.now(),
      1000
    );
  }

  playAnimation(
    anim: string,
    layer: AnimationLayer,
    loop: boolean = true,
    time?: number,
    duration?: number
  ) {
    const lastSameAnimation = this.lastAnimationsByLayer.get(layer);
    // if (
    //   anim === EntityAnimationCode.EMPTY_ANIMATION ||
    //   (lastSameAnimation &&
    //     lastSameAnimation?.name === anim &&
    //     lastSameAnimation?.time !== time)
    // ) {
    //   this.spine.setEmptyAnimation(layer, 0.2);
    // }

    if (anim !== EntityAnimationCode.EMPTY_ANIMATION) {
      if (lastSameAnimation)
        this.spine.setMix(lastSameAnimation!.name, anim, 0.1);
      const track = this.spine.setAnimation(layer, anim, loop, true);

      if (track && duration) {
        const animation = this.spine.findAnimation(anim);
        if (animation) {
          track.timeScale = duration / (animation.duration * 1000);
        }
      }
    }
  }
}
