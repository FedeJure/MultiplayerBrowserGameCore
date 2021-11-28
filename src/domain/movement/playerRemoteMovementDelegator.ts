import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { Player } from "../player/player";
import { PlayerState } from "../player/playerState";
import { ServerConnection } from "../serverConnection";
import { Side } from "../side";

export class PlayerRemoteMovementDelegator implements Delegator {
  private readonly player: Player;
  private readonly connection: ServerConnection;
  private readonly playerStateRepository: PlayerStateRepository;

  private readonly disposer: Disposer = new Disposer();

  constructor(
    player: Player,
    connection: ServerConnection,
    playerStateRepository: PlayerStateRepository
  ) {
    this.player = player;
    this.connection = connection;
    this.playerStateRepository = playerStateRepository;
  }
  init(): void {
    this.disposer.add(
      this.connection.onPlayersStates.subscribe((event) => {
        const state = event.states[this.player.info.id];
        if (state) this.playerStateRepository.setPlayerState(this.player.info.id, state)
      })
    );
  }
  stop(): void {
    this.disposer.dispose();
  }

  update(time: number, delta: number): void {
    const state = this.playerStateRepository.getPlayerState(this.player.info.id)
    if (state) {
      const view = this.player.view;
      view.setScale(
        (state.side == Side.RIGHT ? 1 : -1) *
          Math.abs(this.player.view.scaleX),
        this.player.view.scaleY
      );
      view.setPosition(state.position.x, state.position.y);
      view.setVelocity(state.velocity.x, state.velocity.y);
    }
  }
}
