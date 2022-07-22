import { EntityAnimationCode, AnimationLayer } from "./animations";
import { Entity } from "./entity";
import { EntityAnimations } from "./EntityAnimations";

export class DefaultEntityAnimations implements EntityAnimations {

  protected entity: Entity;
  init(entity: Entity) {
    this.entity = entity;
  }
  update() {
    if (!this.entity.state.isAlive) {
      this.executeAnimation(EntityAnimationCode.DIE, AnimationLayer.MOVEMENT, false)
      return;
    }
    this.processMovementAnimation();
  }

  processMovementAnimation() {
    const movementAnim = this.getMovementAnimation();
    this.executeAnimation(movementAnim, AnimationLayer.MOVEMENT, false)
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
    this.entity.view.playAnimations([
      {
        name: anim,
        layer,
        loop,
        ...(duration ? { duration, time: Date.now() } : {}),
      },
    ]);
  }

  stopAnimations() {
    this.entity.updateState({ anim: [] });
  }
}
