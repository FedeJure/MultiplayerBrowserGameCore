import { Delegator } from "../../delegator";
import { Disposer } from "../../disposer";
import { ServerConnection } from "../../serverConnection";
import { ClientRemotePlayer } from "../players/player";

export class PlayerRemoteMovementDelegator implements Delegator {
  private readonly connection: ServerConnection;

  private readonly disposer: Disposer = new Disposer();

  constructor(private player: ClientRemotePlayer, connection: ServerConnection) {
    this.connection = connection;
  }
  init(): void {
    this.disposer.add(
      this.connection.onPlayersStates.subscribe((event) => {
        this.player.updateState(event.states[this.player.info.id]);
      })
    );
  }
  stop(): void {
    this.disposer.dispose();
  }

  update(time: number, delta: number): void {
  }
}
