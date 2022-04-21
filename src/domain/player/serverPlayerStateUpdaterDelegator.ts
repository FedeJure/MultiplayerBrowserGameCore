import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { ResolvePlayerMovementWithInputs } from "../actions/resolvePlayerMovementWithInput";
import { Delegator } from "../delegator";
import { Player2_0 } from "./player2.0";
import { PlayerInput } from "./playerInput";

export class ServerPlayerStateUpdaterDelegator implements Delegator {
  constructor(
    private player: Player2_0,
    private input: PlayerInput,
    private resolveMovement: ResolvePlayerMovementWithInputs,
    private inputRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return;
    const newState = this.resolveMovement.execute(
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
