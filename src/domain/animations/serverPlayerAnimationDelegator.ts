import { Delegator } from "../delegator";
import { Player } from "../player/player2.0";
import { PlayerState } from "../player/playerState";
import { AnimationCode } from "./animations";

export class ServerPlayerAnimationDelegator implements Delegator {

  constructor(protected player: Player) {
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
      const currentAnim = this.getAnimation(this.player.state);
      if (currentAnim) {
        this.player.updateState({anim: currentAnim})
      }
  }

  protected getAnimation(state: PlayerState) {
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
}
