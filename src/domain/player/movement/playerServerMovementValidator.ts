import { DefaultPlayerState } from "../../../infrastructure/configuration/DefaultPlayerState";
import { InputWithTickDto } from "../../input/inputWithTickDto";
import { ServerPlayer } from "../players/serverPlayer";
import { PlayerState } from "../playerState";
import { MovementPlayerStateDto } from "./movementPlayerStateDto";

export class PlayerServerMovementValidator {
    private readonly bufferSize = 1024;
    private readonly serverTickRate = 30;

    private timer = 0;
    private currentTick = 0;
    private minTimeBetweenTicks = 1 / this.serverTickRate;

    private stateBuffer: MovementPlayerStateDto[];
    private inputQueue: InputWithTickDto[];

    constructor(private player: ServerPlayer) {
        this.stateBuffer = new Array(this.bufferSize);
        this.inputQueue = [];
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
        let bufferIndex = -1;
        while (this.inputQueue.length > 0) {
            const inputPayload = this.inputQueue.shift()!;
            bufferIndex = inputPayload.tick % this.bufferSize;

            const statePayload = this.processMovement(inputPayload);
            this.stateBuffer[bufferIndex] = {
                position: statePayload.position,
                tick: inputPayload.tick,
            };
        }

        if (bufferIndex != -1) {
            this.sendToClient(this.stateBuffer[bufferIndex]);
        }
    }

    processMovement(input: InputWithTickDto): PlayerState {
        return DefaultPlayerState;
    }

    sendToClient(state: MovementPlayerStateDto) { }
}
