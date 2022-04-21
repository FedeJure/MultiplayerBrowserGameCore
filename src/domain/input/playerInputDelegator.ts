import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { PlayerInput } from "../player/playerInput";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";
import { resolvePlayerMovementWithInput } from "../actions/resolvePlayerMovementWithInput";
import { PlayerState } from "../player/playerState";
import { Side } from "../side";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { ClientPlayer } from "../player/player";

export class PlayerInputDelegator implements Delegator {
  private currentInput: PlayerInputDto | undefined;
  private lastInputSended: string = "";
  private savedState: PlayerState | undefined;

  constructor(
    private player: ClientPlayer,
    private input: PlayerInput,
    private connection: ServerConnection,
    private inputRequestRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    const currentInput = this.input.toDto();
    this.currentInput = currentInput;
    const oldState = this.player.state;

    if (
      [this.inputHasChange(), ...Object.values(currentInput)].some((a) => a) ||
      oldState != this.savedState
    ) {
      const newInputRequest =
        this.inputRequestRepository.getOrCreate(this.player.info.id) + 1;
      this.connection.emitInput(
        this.player.info.id,
        currentInput,
        newInputRequest
      );
      this.inputRequestRepository.set(this.player.info.id, newInputRequest);
    }
    if (oldState) {
      const newState = resolvePlayerMovementWithInput(
        this.input,
        this.player.view,
        oldState,
        delta
      );
      this.player.view.setVelocity(newState.velocity.x, newState.velocity.y);
      this.player.view.setPosition(newState.position.x, newState.position.y);
      this.player.view.lookToLeft(newState.side == Side.LEFT);
      this.player.updateState(newState)
      this.savedState = newState;
    }

    this.lastInputSended = JSON.stringify(currentInput);
  }

  inputHasChange() {
    return (
      !this.lastInputSended ||
      JSON.stringify(this.currentInput) != this.lastInputSended
    );
  }
}
