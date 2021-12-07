import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";

export class RemotePlayerAnimationDelegator implements Delegator {
  protected readonly statesRepository: PlayerStateRepository;
  protected readonly player: Player;

  constructor(player: Player, statesRepository: PlayerStateRepository) {
    this.statesRepository = statesRepository;
    this.player = player;
  }
  init(): void {}
  stop(): void {}
  update(time: number, delta: number) {
    const state = this.statesRepository.getPlayerState(this.player.info.id);
    if (state) this.player.view.playAnimation(state.anim);
  }
}
