import { Scene } from "phaser";
import {
  AnimationLayer,
  EntityAnimationCode,
} from "../../domain/entity/animations";
import {
  AnimationDto,
  EmptyAnimations,
} from "../../domain/entity/AnimationDto";
import { EntityIngameHud } from "./entityIngameHud";
import { PhaserEntityView } from "./phaserEntityView";
import { Vector } from "../../domain/vector";

export class SpinePhaserEntityView extends PhaserEntityView {
  protected spine: SpineGameObject;
  protected readonly hud: EntityIngameHud;
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
    const currentSize: Vector = spine.getBounds().size;
    const factor = currentSize.y / height;
    spine.setDisplaySize(currentSize.x / factor + 10, height + 10);
    spine.setSize(width, height);


    super(spine, x, y, height, width);
    this.hud = new EntityIngameHud(scene, height, width);
    this.hud.setDisplayName(name);
    this.setName(name);
    this.add(this.hud);
    this.spine = spine;
    this.lastAnimationsByLayer = new Map();
  }

  override playAnimations(anims: AnimationDto[]): void {
    EmptyAnimations.map(
      (anim) => anims.find((a) => a.layer === anim.layer) ?? anim
    ).forEach((anim) => {
      this.playAnimation(
        anim.name,
        anim.layer,
        anim.loop,
        anim.time,
        anim.duration
      );
      if (anim.name !== EntityAnimationCode.EMPTY_ANIMATION)
        this.lastAnimationsByLayer.set(anim.layer, anim);
    });
  }

  override setLifePercent(percent: number): void {
    this.hud.setLifePercent(percent);
  }

  playAnimation(
    anim: string,
    layer: AnimationLayer,
    loop: boolean = true,
    time?: number,
    duration?: number
  ) {
    const lastSameAnimation = this.lastAnimationsByLayer.get(layer);
    if (
      anim === EntityAnimationCode.EMPTY_ANIMATION ||
      (lastSameAnimation &&
        lastSameAnimation?.name === anim &&
        lastSameAnimation?.time !== time)
    ) {
      this.spine.setEmptyAnimation(layer, 0.2);
    }

    if (anim !== EntityAnimationCode.EMPTY_ANIMATION) {
      if (lastSameAnimation)
        this.spine.setMix(lastSameAnimation!.name, anim, 0.1);
      const track = this.spine.setAnimation(layer, anim, loop, true);
      if (track && duration) {
        const animation = this.spine.findAnimation(anim)
        if (animation) {
          track.timeScale = duration / (animation.duration * 1000)
        }
      } 
    }
  }
}
