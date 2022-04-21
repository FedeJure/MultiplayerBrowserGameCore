import { Delegator } from "../delegator";
import { Player } from "./player";

export class PlayerInfoDelegator implements Delegator {
  constructor(private player: Player) {}
  init(): void {
    this.player.view.setDisplayName(this.player.info.name);
  }
  stop(): void {
  }
  update(time: number, delta: number): void {
  }
}
