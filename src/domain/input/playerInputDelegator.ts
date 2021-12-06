import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";
import { PlayerInput } from "../player/playerInput";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";
import { ResolvePlayerMovementWithInputs } from "../actions/resolvePlayerMovementWithInput";
import { PlayerState } from "../player/playerState";
import { Side } from "../side";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";

export class PlayerInputDelegator implements Delegator {
  private readonly connection: ServerConnection;
  private readonly statesRepository: PlayerStateRepository;
  private readonly player: Player;
  private readonly input: PlayerInput;
  private readonly resolveMovement: ResolvePlayerMovementWithInputs;
  private readonly inputRequestRepository: PlayerInputRequestRepository;

  private currentInput: PlayerInputDto | undefined;
  private lastInputSended: string = "";
  private savedState: PlayerState | undefined;

  constructor(
    player: Player,
    input: PlayerInput,
    connection: ServerConnection,
    statesRepository: PlayerStateRepository,
    resolveMovement: ResolvePlayerMovementWithInputs,
    inputRequestRepository: PlayerInputRequestRepository
  ) {
    this.player = player;
    this.connection = connection;
    this.statesRepository = statesRepository;
    this.input = input;
    this.resolveMovement = resolveMovement;
    this.inputRequestRepository = inputRequestRepository;
  }
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
