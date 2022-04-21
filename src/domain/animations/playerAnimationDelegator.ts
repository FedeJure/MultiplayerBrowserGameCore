import { Player } from "../player/player";
import { ServerPlayerAnimationDelegator } from "./serverPlayerAnimationDelegator";

export class PlayerAnimationDelegator extends ServerPlayerAnimationDelegator {
  constructor(player: Player) {
    super(player);
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    this.player.view.playAnimation(this.getAnimation(this.player.state));
  }
}
