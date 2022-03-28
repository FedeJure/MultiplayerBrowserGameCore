import { filter } from "rxjs";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { Player } from "./player";

export class ClientPlayerConnectionDelegator implements Delegator {
  constructor(private connection: ServerConnection, private player: Player) {}
  init(): void {
    this.connection.onPlayerDisconnected
      .pipe(filter((p) => p.playerId === this.player.info.id))
      .subscribe((_) => {
        this.player.view.destroy();
      });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
