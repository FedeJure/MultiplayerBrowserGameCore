import { AnimationDto } from "./AnimationDto";
import { EntityAnimationCode, AnimationLayer } from "./animations";
import { Entity } from "./entity";
import { EntityAnimations } from "./EntityAnimations";

export class DefaultEntityAnimations implements EntityAnimations {
  private currentAnimPerLayer: Map<AnimationLayer, { anim: AnimationDto }> =
    new Map();
  private entity: Entity;
  init(entity: Entity) {
    this.entity = entity;
  }
  update(time: number, delta: number) {
      this.processAnimation()
  }

  processAnimation() {
    this.entity.updateState({
      anim: [
        ...this.entity.state.anim
          .filter(this.filterCondition)
          .filter(this.filterFinishedAnimations),
        {
          name: this.getMovementAnimation(),
          layer: AnimationLayer.MOVEMENT,
        },
      ],
    });
  }

  private filterCondition(anim: AnimationDto) {
    return anim.layer !== AnimationLayer.MOVEMENT;
  }

  private filterFinishedAnimations(anim: AnimationDto): boolean {
    return (
      anim.duration === undefined ||
      anim.time === undefined ||
      Date.now() <= anim.duration + anim.time
    );
  }

  private getMovementAnimation() {
    const { state } = this.entity;
    const absVelx = Math.abs(state.velocity.x);
    const absVely = Math.abs(state.velocity.y);
    const velY = state.velocity.y;
    if (!state.grounded && velY > 2) return EntityAnimationCode.FALLING;

    if (state.grounded && absVelx > 1 && absVely < 2)
      return EntityAnimationCode.RUNNING;

    if (!state.grounded && absVelx < 1 && velY < 2)
      return EntityAnimationCode.IDLE_JUMP;

    if (!state.grounded && absVelx >= 1 && velY < 2)
      return EntityAnimationCode.RUNNING_JUMP;

    return EntityAnimationCode.IDLE;
  }

  executeAnimation(
    anim: EntityAnimationCode,
    layer: AnimationLayer,
    loop?: boolean,
    duration?: number
  ) {
    const currentAnim = this.currentAnimPerLayer.get(layer);
    if (currentAnim) {
      this.currentAnimPerLayer.delete(layer);
    }

    const newAnim = {
      name: anim,
      layer,
      loop,
      duration,
      time: Date.now(),
    };
    this.currentAnimPerLayer.set(layer, {
      anim: newAnim,
    });

    this.entity.updateState({
      anim: [...this.entity.state.anim, newAnim],
    });
  }
}
