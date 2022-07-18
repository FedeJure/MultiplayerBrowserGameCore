import { ClientConnection } from "../../clientConnection";
import { EntityMovement } from "../../entity/entityMovement";
import { InputWithTickDto } from "../../input/inputWithTickDto";
import { ServerPlayer } from "../players/serverPlayer";
import { PlayerState } from "../playerState";
import { MovementPlayerStateDto } from "./movementPlayerStateDto";
import { resolveMovement } from "./resolveMovement";

export class PlayerServerMovementValidator implements EntityMovement {
  private player: ServerPlayer;
  private readonly bufferSize = 1024;
  private readonly serverTickRate = 30;

  private timer = 0;
  private currentTick = 0;
  private minTimeBetweenTicks = this.serverTickRate;

  private stateBuffer: MovementPlayerStateDto[];
  private inputQueue: InputWithTickDto[];

  constructor(private clientConnection: ClientConnection) {
    this.stateBuffer = new Array(this.bufferSize);
    this.inputQueue = [];
  }

  init(player: ServerPlayer): void {
    this.player = player;
    this.clientConnection.onInput().subscribe(({ input, inputNumber }) => {
      this.inputQueue.push({ ...input, tick: inputNumber });
    });
  }

  update(time: number, delta: number) {
    this.timer += delta;
    while (this.timer >= this.minTimeBetweenTicks) {
      this.timer -= this.minTimeBetweenTicks;
      this.handleTick();
      if (this.currentTick === 5000) this.currentTick = 0;
      else this.currentTick++;
    }
  }

  handleTick() {
    let bufferIndex = -1;

    while (this.inputQueue.length > 0) {
      const inputPayload = this.inputQueue.pop()!;
      bufferIndex = inputPayload.tick % this.bufferSize;
      
      const state = this.processMovement(inputPayload, this.player.state)
      this.player.updateState(state)
      this.stateBuffer[bufferIndex] = {
        position: this.player.view.positionVector,
        tick: inputPayload.tick,
      };
    }
    if (bufferIndex != -1) {
      this.sendToClient(this.stateBuffer[bufferIndex]);
    }
  }

  processMovement(
    input: InputWithTickDto,
    state: PlayerState
  ): Partial<PlayerState> {
    return resolveMovement(
      state,
      input,
      this.player.stats,
      this.player.view,
      Date.now(),
      this.minTimeBetweenTicks,
      true
    );
  }

  sendToClient(state: MovementPlayerStateDto) {
    this.clientConnection.sendPositionChange(state);
  }
}
