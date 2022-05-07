import { AnimationCode, AnimationLayer } from "../../animations/animations";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { ServerPlayer } from "../players/serverPlayer";
import { AnimationDto } from "./AnimationDto";

export class AnimationSystem {
  private currentAnimPerLayer: Map<AnimationLayer, { anim: AnimationDto }> =
    new Map();

  constructor(private player: LocalClientPlayer) {}
  processAnimation(player: LocalClientPlayer | ServerPlayer) {
    player.updateState({
      animations: [
        ...player.state.animations
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

  private getMovementAnimation(player: LocalClientPlayer | ServerPlayer) {
    const { state } = player;
    const absVelx = Math.abs(state.velocity.x);
    const absVely = Math.abs(state.velocity.y);
    const velY = state.velocity.y;
    if (!state.grounded && velY > 2) return AnimationCode.FALLING;

    if (state.grounded && absVelx > 1 && absVely < 2)
      return AnimationCode.RUNNING;

    if (!state.grounded && absVelx < 1 && velY < 2)
      return AnimationCode.IDLE_JUMP;

    if (!state.grounded && absVelx >= 1 && velY < 2)
      return AnimationCode.RUNNING_JUMP;

    return AnimationCode.IDLE;
  }

  executeAnimation(
    anim: AnimationCode,
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
      animations: [...this.player.state.animations, newAnim],
    });
  }
}
