import { AnimationCode } from "../animations/animations";
import { PlayerState } from "../player/playerState";

export function resolveMovementAnimationForPlayer(state: PlayerState): AnimationCode {
    const absVelx = Math.abs(state.velocity.x);
    const absVely = Math.abs(state.velocity.y);
    const velY = state.velocity.y;
    // if (state.grounded && absVely === 0 && absVelx === 0) return AnimationCode.IDLE;
    if (!state.grounded && velY > 2) return AnimationCode.FALLING;

    if (state.grounded && absVelx > 1 && absVely < 2)
      return AnimationCode.RUNNING;

    if (!state.grounded && absVelx < 1 && velY < 2) return AnimationCode.IDLE_JUMP;

    if (!state.grounded && absVelx >= 1 && velY <2) return AnimationCode.RUNNING_JUMP;

    
    return AnimationCode.IDLE;
}