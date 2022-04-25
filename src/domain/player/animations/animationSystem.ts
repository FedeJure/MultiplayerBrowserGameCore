import { AnimationCode } from "../../animations/animations";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { ServerPlayer } from "../players/serverPlayer";

export class AnimationSystem {
  processAnimation(player: LocalClientPlayer | ServerPlayer) {
    if (!player.state.attacking)
      player.updateState({ anim: this.getMovementAnimation(player) });
    else player.updateState({ anim: this.getAttackAnimation(player) });
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

  private getAttackAnimation(player: LocalClientPlayer | ServerPlayer) {
    return AnimationCode.BASIC_ATTACK;
  }
}
