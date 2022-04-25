import { Delegator } from "../delegator";
import { Player } from "../player/players/player";

export class PlayerAnimationDelegator implements Delegator {

  constructor(private player: Player) {
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number) {
    this.player.view.playAnimation(this.player.state.anim);
  }
}
