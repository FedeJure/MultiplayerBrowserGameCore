import { Delegator } from "../delegator";
import { Player } from "../player/player2.0";

export class RemotePlayerAnimationDelegator implements Delegator {

  constructor(private player: Player) {
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number) {
    this.player.view.playAnimation(this.player.state.anim);
  }
}
