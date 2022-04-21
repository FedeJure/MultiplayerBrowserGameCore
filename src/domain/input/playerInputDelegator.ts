import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { PlayerInput } from "../player/playerInput";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";
import { ResolvePlayerMovementWithInputs } from "../actions/resolvePlayerMovementWithInput";
import { PlayerState } from "../player/playerState";
import { Side } from "../side";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { Player } from "../player/player";

export class PlayerInputDelegator implements Delegator {
  private currentInput: PlayerInputDto | undefined;
  private lastInputSended: string = "";
  private savedState: PlayerState | undefined;

  constructor(
    private player: Player,
    private input: PlayerInput,
    private connection: ServerConnection,
    private statesRepository: PlayerStateRepository,
    private resolveMovement: ResolvePlayerMovementWithInputs,
    private inputRequestRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    const currentInput = this.input.toDto();
    this.currentInput = currentInput;
    const oldState = this.statesRepository.getPlayerState(this.player.info.id);

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
      const newState = this.resolveMovement.execute(
        this.input,
        this.player.view,
        oldState,
        delta
      );
      this.player.view.setVelocity(newState.velocity.x, newState.velocity.y);
      this.player.view.setPosition(newState.position.x, newState.position.y);
      this.player.view.lookToLeft(newState.side == Side.LEFT);
      this.statesRepository.setPlayerState(this.player.info.id, newState);
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
