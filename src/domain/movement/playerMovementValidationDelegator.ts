import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { ServerConnection } from "../serverConnection";
import { ClientPlayer } from "../player/player";

export class PlayerMovementValidationDelegator implements Delegator {
  private readonly disposer: Disposer = new Disposer();
  private lastInputValidated: number = 0;
  private remotePosition: { x: number; y: number } = Phaser.Math.Vector2.ZERO;

  constructor(
    private readonly player: ClientPlayer,
    private readonly connection: ServerConnection,
    private readonly inputRepository: PlayerInputRequestRepository
  ) {
    this.player = player;
    this.connection = connection;
    this.inputRepository = inputRepository;
  }
  update(time: number, delta: number): void {
    const localState = this.player.state;
    if (localState) {
      const currentPosition = this.player.view.positionVector;
      const x = Phaser.Math.Interpolation.SmoothStep(
        0.5,
        currentPosition.x,
        this.remotePosition.x
      );
      const y = Phaser.Math.Interpolation.SmoothStep(
        0.5,
        currentPosition.y,
        this.remotePosition.y
      );
      this.player.view.setPosition(x, y);
    }
  }

  init() {
    this.disposer.add(
      this.connection.onPlayersStates.subscribe((event) => {
        const state = event.states[this.player.info.id];
        if (!state) return;
        this.remotePosition = state.position;
        if (
          state &&
          this.inputRepository.getOrCreate(this.player.info.id) ==
            state.inputNumber &&
          state.inputNumber >= this.lastInputValidated
        ) {
          this.lastInputValidated = state.inputNumber;
        }
      })
    );
  }

  stop() {}
}
