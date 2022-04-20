import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { ResolvePlayerMovementWithInputs } from "../actions/resolvePlayerMovementWithInput";
import { Delegator } from "../delegator";
import { Player } from "./player";
import { PlayerInput } from "./playerInput";

export class ServerPlayerStateUpdaterDelegator implements Delegator {
  constructor(
    private player: Player,
    private input: PlayerInput,
    private resolveMovement: ResolvePlayerMovementWithInputs,
    private playerStates: PlayerStateRepository,
    private inputRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return
    const oldState = this.playerStates.getPlayerState(this.player.info.id);
    if (oldState) {
      const newState = this.resolveMovement.execute(
        this.input,
        this.player.view,
        oldState,
        delta
      );
      this.playerStates.updateStateOf(this.player.info.id, {
        ...newState,
        inputNumber: this.inputRepository.getOrCreate(this.player.info.id),
      });
      this.player.view.setVelocity(newState.velocity.x, newState.velocity.y);
    }
  }
}
