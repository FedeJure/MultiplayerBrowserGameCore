import { Delegator } from "../../delegator";
import { ClientPlayer } from "../player";

export class PlayerAngleFixDelegator implements Delegator {
  constructor(private player: ClientPlayer) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    try {
      this.player.view.setAngle(0);
    } catch (error) {}
  }
}
