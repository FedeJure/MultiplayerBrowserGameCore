import { EntityAnimationCode, AnimationLayer } from "../../entity/animations";
import { ControllablePlayer } from "../players/controllablePlayer";
import { ServerPlayer } from "../players/serverPlayer";
import { AnimationDto } from "../../entity/AnimationDto";

export class AnimationSystem {
  private currentAnimPerLayer: Map<AnimationLayer, { anim: AnimationDto }> =
    new Map();

  constructor(private player: ControllablePlayer) {}
  processAnimation(player: ControllablePlayer | ServerPlayer) {
    player.updateState({
      anim: [
        ...player.state.anim
          .filter(this.filterCondition)
          .filter(this.filterFinishedAnimations),
        {
          name: this.getMovementAnimation(player),
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

  private getMovementAnimation(player: ControllablePlayer | ServerPlayer) {
    const { state } = player;
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

    this.player.updateState({
      anim: [...this.player.state.anim, newAnim],
    });
  }
}
