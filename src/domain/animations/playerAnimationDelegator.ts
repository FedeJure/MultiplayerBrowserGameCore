import { ServerPlayerAnimationDelegator } from "./serverPlayerAnimationDelegator";

export class PlayerAnimationDelegator extends ServerPlayerAnimationDelegator {
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    const state = this.statesRepository.getPlayerState(this.player.info.id);
    if (state) {
      const currentAnim = this.getAnimation(state);
      this.player.view.playAnimation(currentAnim);
    }
  }
}
