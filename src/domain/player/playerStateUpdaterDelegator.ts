import { Delegator } from "../delegator";
import { Player } from "./players/player";

export class PlayerStateUpdaterDelegator implements Delegator {
  constructor(
    private player: Player
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return;
    this.player.update(time,delta)
    this.player.postUpdate()
  }
}
