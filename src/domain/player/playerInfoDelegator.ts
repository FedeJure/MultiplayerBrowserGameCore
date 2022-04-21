import { Delegator } from "../delegator";
import { Player2_0 } from "./player2.0";

export class PlayerInfoDelegator implements Delegator {
  constructor(private player: Player2_0) {}
  init(): void {
    this.player.view.setDisplayName(this.player.info.name);
  }
  stop(): void {
  }
  update(time: number, delta: number): void {
  }
}
