import { Delegator } from "../delegator";
import { PlayerInput } from "./playerInput";
import { Player } from "./players/player";

export class ServerPlayerStateUpdaterDelegator implements Delegator {
  constructor(
    private player: Player,
    private input: PlayerInput,
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return;
    this.player.update(time,delta)
  }
}
