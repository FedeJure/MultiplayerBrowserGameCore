import { Delegator } from "../delegator";
import { Player2_0 } from "../player/player2.0";

export class RemotePlayerAnimationDelegator implements Delegator {

  constructor(private player: Player2_0) {
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number) {
    this.player.view.playAnimation(this.player.state.anim);
  }
}
