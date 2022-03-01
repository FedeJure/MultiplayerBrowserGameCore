import { Math as PhaserMath } from "phaser";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { Player } from "../player/player";
import { PlayerState } from "../player/playerState";
import { ServerConnection } from "../serverConnection";
import { PlayerInput } from "../player/playerInput";

export class PlayerMovementValidationDelegator implements Delegator {
  private readonly disposer: Disposer = new Disposer();
  private lastInputValidated: number = 0;

  constructor(
    private readonly player: Player,
    private readonly connection: ServerConnection,
    private readonly stateRepository: PlayerStateRepository,
    private readonly inputRepository: PlayerInputRequestRepository,
    private readonly input: PlayerInput
  ) {
    this.player = player;
    this.connection = connection;
    this.stateRepository = stateRepository;
    this.inputRepository = inputRepository;
  }
  update(time: number, delta: number): void {}

  init() {
    this.disposer.add(
      this.connection.onPlayersStates.subscribe((event) => {
        const state = event.states[this.player.info.id];
        if (
          state &&
          this.inputRepository.getOrCreate(this.player.info.id) ==
            state.inputNumber &&
          state.inputNumber >= this.lastInputValidated
        ) {
          this.lastInputValidated = state.inputNumber;
          // const localState = this.stateRepository.getPlayerState(
          //   this.player.info.id
          // );
          // if (localState) this.validatePosition(state);
          this.validatePosition(state);
        }
      })
    );
  }

  private validatePosition(remoteState: PlayerState) {
    // this.player.view.moveTo(remoteState.position.x, remoteState.position.y, 0);

    const currentPosition = this.player.view.position;
    const directionVector = {
      x: currentPosition.x - remoteState.position.x,
      y: currentPosition.y - remoteState.position.y,
    };
    const distance = PhaserMath.Distance.BetweenPoints(remoteState.position, this.player.view.position)

    this.player.view.scene.matter.body.applyForce(
      this.player.view.matterBody,
      this.player.view.position,
      directionVector
    );

    // const auxDistance = this.lastDistance
    // this.lastDistance = distance

    // if (Math.abs(distance - auxDistance) < 10) {
    //   this.lastDistance = distance
    //   return
    // }
    // const anyInputActive = Boolean(
    //   this.input.down ||
    //     this.input.up ||
    //     this.input.left ||
    //     this.input.right ||
    //     this.input.jump
    // );
    // // if (state.jumping || anyInputActive) return

    // // const localFactor = state.position.x / state.position.y;
    // // const remoteFactor = remoteState.position.x / remoteState.position.y;
    // if (
    //   // !anyInputActive &&
    //   // ((remoteState.velocity.x === 0 && remoteState.velocity.y === 0))
    //   true
    // ) {
    //   this.player.view.moveTo(
    //     remoteState.position.x,
    //     remoteState.position.y,
    //     0
    //   );
    // }
  }

  stop() {}
}
