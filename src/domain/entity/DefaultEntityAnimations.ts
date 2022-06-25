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
    if (!this.entity.state.isAlive) {
      this.entity.updateState({anim: [{layer: AnimationLayer.MOVEMENT, name: EntityAnimationCode.DIE}]})
      return
    }
    this.processAnimation();
  }

  processAnimation() {
    this.entity.updateState({
      anim: [
        ...this.entity.state.anim
          .filter(this.filterCondition)
          .filter(this.filterFinishedAnimations)
          .filter(this.removeRepetedLayerAnimations),
        {
          name: this.getMovementAnimation(),
          layer: AnimationLayer.MOVEMENT,
        },
      ],
    });
  }

  private removeRepetedLayerAnimations(
    anim: AnimationDto,
    i: number,
    array: AnimationDto[]
  ) {
    const sameLayer = array.filter((a) => a.layer === anim.layer);
    if (sameLayer.length <= 1) return true;
    return anim.name === sameLayer[0].name;
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
    const { state, stats } = this.entity;

    const absVelx = Math.abs(state.velocity.x);
    const absVely = Math.abs(state.velocity.y);

    if (state.inLadder && (absVelx > 0 || absVely > 0)) {
      return EntityAnimationCode.WALK;
    }
    const velY = state.velocity.y;
    if (!state.grounded && velY > 2) return EntityAnimationCode.FALLING;
    if (
      state.grounded &&
      absVelx === stats.walkSpeed &&
      absVely < 1 &&
      !this.entity.view.blocked
    )
      return EntityAnimationCode.WALK;
    if (
      state.grounded &&
      absVelx === stats.runSpeed &&
      absVely < 1 &&
      !this.entity.view.blocked
    )
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
    let oldAnims = this.entity.state.anim;
    if (currentAnim) {
      this.currentAnimPerLayer.delete(layer);
      oldAnims = oldAnims.filter((a) => a.layer === layer);
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
      anim: [...oldAnims, newAnim],
    });
  }

  stopAnimations() {
    this.entity.updateState({ anim: [] });
  }
}
