import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Player } from "../player/player";

export class PlayerCollisionDelegator implements Delegator {
  private readonly player: Player;
  private readonly statesRepository: PlayerStateRepository;

  private readonly disposer: Disposer = new Disposer();

  constructor(player: Player, statesRepository: PlayerStateRepository) {
    this.player = player;
    this.statesRepository = statesRepository;
  }
  update(time: number, delta: number): void {}

  init(): void {
    this.disposer.add(
      this.player.view.onGroundCollideChange.subscribe((grounded) => {
        this.statesRepository.setPlayerState(this.player.info.id, {
          ...this.player.state,
          grounded,
        });
      })
    );
  }
  stop(): void {
    this.disposer.dispose();
  }
}
