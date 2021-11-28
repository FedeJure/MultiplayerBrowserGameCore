import { setupPlayerAnimations } from "../actions/createAnimationsForPlayer";
import { playAnim } from "../actions/playAnimation";
import { ServerPlayerAnimationDelegator } from "./serverPlayerAnimationDelegator";

export class PlayerAnimationDelegator extends ServerPlayerAnimationDelegator {
  init(): void {
    setupPlayerAnimations(this.player);
  }
  stop(): void {}
  update(time: number, delta: number): void {
    const state = this.statesRepository.getPlayerState(this.player.info.id);
    if (state) {
      const currentAnim = this.getAnimation(state);
      playAnim(this.player, currentAnim);
    }
  }
}
