import { Delegator } from "../../delegator";
import { Player } from "../players/player";

export class PlayerAngleFixDelegator implements Delegator {
  constructor(private player: Player) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    try {
      this.player.view.setAngle(0);
    } catch (error) {}
  }
}
