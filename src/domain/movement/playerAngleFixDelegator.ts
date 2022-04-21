import { Delegator } from "../delegator";
import { Player2_0 } from "../player/player2.0";

export class PlayerAngleFixDelegator implements Delegator {
  constructor(private player: Player2_0) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    this.player.view.setAngle(0);
  }
}
