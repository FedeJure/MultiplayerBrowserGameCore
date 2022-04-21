import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";
import { Side } from "../side";

export class PlayerRemoteMovementDelegator implements Delegator {
  private readonly connection: ServerConnection;

  private readonly disposer: Disposer = new Disposer();

  constructor(private player: Player, connection: ServerConnection) {
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
    const view = this.player.view;
    view.lookToLeft(this.player.state.side === Side.LEFT);
    view.setPosition(
      this.player.state.position.x,
      this.player.state.position.y
    );
    view.setVelocity(
      this.player.state.velocity.x,
      this.player.state.velocity.y
    );
  }
}
