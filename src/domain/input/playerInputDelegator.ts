import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { PlayerInput } from "../player/playerInput";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";
import { PlayerState } from "../player/playerState";
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

    if (
      [this.inputHasChange(), ...Object.values(currentInput)].some((a) => a) ||
      this.player.state != this.savedState
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
      this.player.processCombat(this.input)
      this.player.processMovement(this.input, delta)
      this.savedState = this.player.state;

    this.lastInputSended = JSON.stringify(currentInput);
  }

  inputHasChange() {
    return (
      !this.lastInputSended ||
      JSON.stringify(this.currentInput) != this.lastInputSended
    );
  }
}
