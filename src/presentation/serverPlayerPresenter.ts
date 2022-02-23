import { ResolvePlayerMovementWithInputs } from "../domain/actions/resolvePlayerMovementWithInput";
import { Delegator } from "../domain/delegator";
import { Player } from "../domain/player/player";
import { PlayerInput } from "../domain/player/playerInput";
import { PlayerInputRequestRepository } from "../infrastructure/repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../infrastructure/repositories/playerStateRepository";

export class ServerPlayerPresenter {
  private readonly player: Player;
  private readonly input: PlayerInput;
  private readonly resolveMovement: ResolvePlayerMovementWithInputs;
  private readonly playerStates: PlayerStateRepository;
  private readonly delegators: Delegator[];
  private readonly inputRepository: PlayerInputRequestRepository;
  constructor(
    player: Player,
    input: PlayerInput,
    resolveMovement: ResolvePlayerMovementWithInputs,
    playerStates: PlayerStateRepository,
    delegators: Delegator[],
    inputRepository: PlayerInputRequestRepository
  ) {
    this.player = player;
    this.input = input;
    this.resolveMovement = resolveMovement;
    this.playerStates = playerStates;
    this.delegators = delegators;
    this.inputRepository = inputRepository;
    player.view.onUpdate.subscribe(this.update.bind(this));
    this.delegators.forEach((d) => d.init());
  }

  update({ time, delta }: { time: number; delta: number }) {
    this.delegators.forEach((d) => d.update(time, delta));
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
