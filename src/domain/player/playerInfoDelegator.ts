import { Delegator } from "../delegator";
import { ClientPlayer } from "./localPlayer";

export class PlayerInfoDelegator implements Delegator {
  constructor(private player: ClientPlayer) {}
  init(): void {
    this.player.view.setDisplayName(this.player.info.name);
  }
  stop(): void {
  }
  update(time: number, delta: number): void {
  }
}
