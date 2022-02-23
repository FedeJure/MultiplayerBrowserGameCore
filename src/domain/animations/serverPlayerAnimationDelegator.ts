import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { PlayerState } from "../player/playerState";
import { AnimationCode } from "./animations";

export class ServerPlayerAnimationDelegator implements Delegator {
  protected readonly statesRepository: PlayerStateRepository;
  protected readonly player: Player;

  constructor(player: Player, statesRepository: PlayerStateRepository) {
    this.statesRepository = statesRepository;
    this.player = player;
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    const state = this.statesRepository.getPlayerState(this.player.info.id);
    if (state) {
      const currentAnim = this.getAnimation(state);
      if (currentAnim) {
        this.statesRepository.updateStateOf(this.player.info.id, {anim: currentAnim})
      }
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
