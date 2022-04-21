import { filter } from "rxjs";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { ServerConnection } from "../serverConnection";
import { ClientPlayer } from "./player";

export class ClientPlayerConnectionDelegator implements Delegator {
  private disposer = new Disposer();
  constructor(private connection: ServerConnection, private player: ClientPlayer) {}
  init(): void {
    this.disposer.add(
      this.connection.onPlayerDisconnected
        .pipe(filter((p) => p.playerId === this.player.info.id))
        .subscribe((_) => {
          console.log("Player disconnected");
          this.player.destroy();
        })
    );
  }
  stop(): void {
    this.disposer.dispose()
  }
  update(time: number, delta: number): void {}
}
