import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";
import { ClientPlayerInput } from "../player/playerInput";
import { PlayerInputDto } from "../../infrastructure/dtos/playerInputDto";
import { PlayerState } from "../player/playerState";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { ControllablePlayer } from "../player/players/controllablePlayer";

export class PlayerInputDelegator implements Delegator {
  constructor(
    private player: ControllablePlayer,
    private input: ClientPlayerInput,
    private connection: ServerConnection,
    private inputRequestRepository: PlayerInputRequestRepository
  ) {}
  init(): void {
    this.input.onInputChange.subscribe(() => {
      this.connection.emitInput(
        this.player.info.id,
        this.input.toDto(),
        this.inputRequestRepository.getOrCreate(this.player.info.id) + 1
      );
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {
  }
}
