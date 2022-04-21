import { Player2_0 } from "../player/player2.0";
import { ServerPlayerAnimationDelegator } from "./serverPlayerAnimationDelegator";

export class PlayerAnimationDelegator extends ServerPlayerAnimationDelegator {
  constructor(player: Player2_0) {
    super(player)
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
      const currentAnim = this.player.state.anim;
      this.player.view.playAnimation(currentAnim);
  }
}
