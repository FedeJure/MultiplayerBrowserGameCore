import { Vector } from "matter";
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

  private lastErrorReported: number = 0;
  private consecutiveIncreasingErrors: number = 0;

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
      this.handleTick(time);
      if (this.currentTick === 5000) this.currentTick = 0;
      else this.currentTick++;
    }
  }

  handleTick(time: number) {
    if (
      this.latestServerState &&
      (!this.lastProcessedState ||
        this.latestServerState!.tick !== this.lastProcessedState!.tick)
    ) {
      this.handleServerReconciliation(time);
    }

    let bufferIndex = this.currentTick % this.bufferSize;
    let inputPayload: InputWithTickDto = {
      ...this.player.input.toDto(),
      tick: this.currentTick,
    };
    this.inputBuffer[bufferIndex] = inputPayload;
    this.processMovement(inputPayload, time);
    this.stateBuffer[bufferIndex] = {
      position: this.player.view.positionVector,
      tick: this.currentTick,
    };

    this.sendToServer(inputPayload);
  }

  handleServerReconciliation(time: number) {
    if (!this.latestServerState) return;
    const latestServerState = { ...this.latestServerState };

    let serverStateBufferIndex = latestServerState.tick % this.bufferSize;

    if (
      !this.stateBuffer[serverStateBufferIndex].position ||
      !latestServerState.position
    )
      return;

    this.lastProcessedState = this.latestServerState;
    let positionError = Phaser.Math.Distance.BetweenPoints(
      latestServerState.position,
      this.stateBuffer[serverStateBufferIndex].position
    );

    if (positionError > 50) {
      console.log("Reconciliation with server");
      // const x = Phaser.Math.Interpolation.SmoothStep(
      //     0.8,
      //     latestServerState.position.x,
      //     this.stateBuffer[serverStateBufferIndex].position.x
      //   );
      //   const y = Phaser.Math.Interpolation.SmoothStep(
      //     0.8,
      //     latestServerState.position.y,
      //     this.stateBuffer[serverStateBufferIndex].position.y
      //   );
      this.player.view.setPosition(
        latestServerState.position.x,
        latestServerState.position.y
      );
      // if (positionError > 10 && this.lastErrorReported < positionError)
      //   this.consecutiveIncreasingErrors++;
      // else this.consecutiveIncreasingErrors = 0;
      // this.lastErrorReported = positionError;
      // if (this.consecutiveIncreasingErrors > 10)
      //   this.player.view.setPosition(
      //     latestServerState.position.x,
      //     latestServerState.position.y
      //   );

      this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

      let tickToProcess = this.latestServerState.tick + 1;
      while (tickToProcess < this.currentTick) {
        const bufferIndex = tickToProcess % this.bufferSize;

        const statePayload = this.processMovement(
          this.inputBuffer[bufferIndex],
          time
        );

        this.stateBuffer[bufferIndex] = {
          position: statePayload.position!,
          tick: tickToProcess,
        };
        tickToProcess++;
      }
    }
  }

  processMovement(input: InputWithTickDto, time: number): Partial<PlayerState> {
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
    // if (!this.inputHasChange) return;
    this.inputHasChange = false;
    this.serverConnection.emitInput(
      this.player.info.id,
      inputPayload,
      inputPayload.tick
    );
  }
}
