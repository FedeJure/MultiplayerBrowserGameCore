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
    const state = this.processMovement(inputPayload, time);
    this.player.updateState(state)
    
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
      this.player.view.setPosition(
        latestServerState.position.x,
        latestServerState.position.y
      );

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
    this.serverConnection.emitInput(
      this.player.info.id,
      inputPayload,
      inputPayload.tick
    );
  }
}
