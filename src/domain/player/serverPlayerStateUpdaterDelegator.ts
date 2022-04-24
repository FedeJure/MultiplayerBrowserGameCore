import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { resolvePlayerMovementWithInput } from "../actions/resolvePlayerMovementWithInput";
import { Delegator } from "../delegator";
import { ClientPlayer } from "./player";
import { PlayerInput } from "./playerInput";

export class ServerPlayerStateUpdaterDelegator implements Delegator {
  constructor(
    private player: ClientPlayer,
    private input: PlayerInput,
    private inputRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (!this.player.view.active) return;
    this.player.processCombat(this.input);
    this.player.processMovement(this.input, delta);
  }
}
