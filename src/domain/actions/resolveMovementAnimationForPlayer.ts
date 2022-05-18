import { EntityAnimationCode } from "../entity/animations";
import { PlayerState } from "../player/playerState";

export function resolveMovementAnimationForPlayer(state: PlayerState): EntityAnimationCode {
    const absVelx = Math.abs(state.velocity.x);
    const absVely = Math.abs(state.velocity.y);
    const velY = state.velocity.y;
    // if (state.grounded && absVely === 0 && absVelx === 0) return AnimationCode.IDLE;
    if (!state.grounded && velY > 2) return EntityAnimationCode.FALLING;

    if (state.grounded && absVelx > 1 && absVely < 2)
      return EntityAnimationCode.RUNNING;

    if (!state.grounded && absVelx < 1 && velY < 2) return EntityAnimationCode.IDLE_JUMP;

    if (!state.grounded && absVelx >= 1 && velY <2) return EntityAnimationCode.RUNNING_JUMP;

    
    return EntityAnimationCode.IDLE;
}