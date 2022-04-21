import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { resolvePlayerMovementWithInput } from "../actions/resolvePlayerMovementWithInput";
import { Delegator } from "../delegator";
import { Player } from "./player";
import { PlayerInput } from "./playerInput";

export class ServerPlayerStateUpdaterDelegator implements Delegator {
  constructor(
    private player: Player,
    private input: PlayerInput,
    private inputRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return;
    const newState = resolvePlayerMovementWithInput(
      this.input,
      this.player.view,
      this.player.state,
      delta
    );
    this.player.updateState({
      ...newState,
      inputNumber: this.inputRepository.getOrCreate(this.player.info.id),
    });
    this.player.view.setVelocity(newState.velocity.x, newState.velocity.y);
  }
}
