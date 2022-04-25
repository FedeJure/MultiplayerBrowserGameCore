import { Delegator } from "../delegator";
import { ClientPlayer } from "../player/player";

export class PlayerAnimationDelegator implements Delegator {

  constructor(private player: ClientPlayer) {
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number) {
    this.player.view.playAnimation(this.player.state.anim);
  }
}
