import { Delegator } from "../delegator";
import { Player } from "../player/player2.0";

export class PlayerAngleFixDelegator implements Delegator {
  constructor(private player: Player) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    this.player.view.setAngle(0);
  }
}
