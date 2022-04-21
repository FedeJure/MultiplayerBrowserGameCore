import { Delegator } from "../delegator";
import { ClientPlayer } from "../player/player";

export class PlayerAngleFixDelegator implements Delegator {
  constructor(private player: ClientPlayer) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    this.player.view.setAngle(0);
  }
}
