import { EntityMovement } from "../../entity/entityMovement";
import { InputWithTickDto } from "../../input/inputWithTickDto";
import { ServerConnection } from "../../serverConnection";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { PlayerState } from "../playerState";
import { MovementPlayerStateDto } from "./movementPlayerStateDto";
import { resolveMovement } from "./resolveMovement";

export class PlayerClientMovementValidator implements EntityMovement {
  private player: LocalClientPlayer;

  private readonly bufferSize = 1024;
  private readonly serverTickRate = 30;

  private timer = 0;
  private currentTick = 0;
  private minTimeBetweenTicks = this.serverTickRate;
  private inputHasChange = false;

  private stateBuffer: MovementPlayerStateDto[];
  private inputBuffer: InputWithTickDto[];
  private latestServerState: MovementPlayerStateDto | undefined;
  private lastProcessedState: MovementPlayerStateDto | undefined;
  constructor(private serverConnection: ServerConnection) {
    this.stateBuffer = new Array(this.bufferSize);
    this.inputBuffer = new Array(this.bufferSize);
    serverConnection.onPositionChange.subscribe((data) => {
      this.latestServerState = data;
    });
  }

  init(player: LocalClientPlayer): void {
    this.player = player;

    setTimeout(() => {
      //Refactor this
      this.player.input.onInputChange.subscribe(() => {
        this.inputHasChange = true;
      });
    }, 1000);
  }

  update(time: number, delta: number) {
    this.timer += delta;
    while (this.timer >= this.minTimeBetweenTicks) {
      this.timer -= this.minTimeBetweenTicks;
      this.handleTick();
      this.currentTick++;
    }
  }

  handleTick() {
    if (
      this.latestServerState &&
      (!this.lastProcessedState ||
        this.latestServerState!.tick !== this.lastProcessedState!.tick)
    ) {
      this.handleServerReconciliation();
    }

    let bufferIndex = this.currentTick % this.bufferSize;

    let inputPayload: InputWithTickDto = {
      ...this.player.input.toDto(),
      tick: this.currentTick,
    };
    this.inputBuffer[bufferIndex] = inputPayload;
    this.processMovement(inputPayload);

    this.stateBuffer[bufferIndex] = {
      position: this.player.view.positionVector,
      tick: this.currentTick,
    };

    this.sendToServer(inputPayload);
  }

  handleServerReconciliation() {
    if (!this.latestServerState) return;

    let serverStateBufferIndex = this.latestServerState.tick % this.bufferSize;

    if (
      !this.stateBuffer[serverStateBufferIndex].position ||
      !this.latestServerState.position
    )
      return;

    this.lastProcessedState = this.latestServerState;
    let positionError = Phaser.Math.Distance.BetweenPoints(
      this.latestServerState.position,
      this.stateBuffer[serverStateBufferIndex].position
    );

    if (positionError > 0.1) {
      console.log("Reconciliation with server");
      this.player.view.setPosition(
        this.latestServerState.position.x,
        this.latestServerState.position.y
      );

      this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

      let tickToProcess = this.latestServerState.tick + 1;

      while (tickToProcess < this.currentTick) {
        const bufferIndex = tickToProcess % this.bufferSize;

        const statePayload = this.processMovement(
          this.inputBuffer[bufferIndex]
        );
        this.player.updateState(statePayload);

        this.stateBuffer[bufferIndex] = {
          position: statePayload.position!,
          tick: tickToProcess,
        };
        tickToProcess++;
      }
    }
  }

  processMovement(input: InputWithTickDto): Partial<PlayerState> {
    return resolveMovement(
      this.player.state,
      input,
      this.player.stats,
      this.player.view,
      Date.now(),
      this.minTimeBetweenTicks
    );
  }

  sendToServer(inputPayload: InputWithTickDto) {
    if (!this.inputHasChange) return;
    this.inputHasChange = false;
    this.serverConnection.emitInput(
      this.player.info.id,
      inputPayload,
      inputPayload.tick
    );
  }
}
