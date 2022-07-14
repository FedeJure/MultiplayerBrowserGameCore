import { DefaultPlayerState } from "../../../infrastructure/configuration/DefaultPlayerState";
import { InputWithTickDto } from "../../input/inputWithTickDto";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { PlayerState } from "../playerState";
import { MovementPlayerStateDto } from "./movementPlayerStateDto";

export class PlayerClientMovementValidator {
    private readonly bufferSize = 1024;
    private readonly serverTickRate = 30;

    private timer = 0;
    private currentTick = 0;
    private minTimeBetweenTicks = 1 / this.serverTickRate;

    private stateBuffer: MovementPlayerStateDto[];
    private inputBuffer: InputWithTickDto[];
    private latestServerState: MovementPlayerStateDto | undefined;
    private lastProcessedState: MovementPlayerStateDto | undefined;
    constructor(private player: LocalClientPlayer) {
        this.stateBuffer = new Array(this.bufferSize);
        this.inputBuffer = new Array(this.bufferSize);
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
        if ((!this.latestServerState && !this.lastProcessedState) ||
            this.latestServerState !== this.lastProcessedState) {
            this.handleServerReconciliation();
        }

        let bufferIndex = this.currentTick % this.bufferSize;

        // Add payload to inputBuffer
        let inputPayload: InputWithTickDto = {
            ...this.player.input.toDto(),
            tick: this.currentTick,
        };
        this.inputBuffer[bufferIndex] = inputPayload;

        // Add payload to stateBuffer
        this.stateBuffer[bufferIndex] = {
            ...this.processMovement(inputPayload),
            tick: this.currentTick,
        };

        // Send input to server
        this.sendToServer(inputPayload);
    }

    handleServerReconciliation() {
        if (!this.latestServerState)
            return;

        this.lastProcessedState = this.latestServerState;
        let serverStateBufferIndex = this.latestServerState.tick % this.bufferSize;
        let positionError = Phaser.Math.Distance.BetweenPoints(
            this.latestServerState.position,
            this.stateBuffer[serverStateBufferIndex].position
        );

        if (positionError > 0.001) {
            console.log("Reconciliation with server");
            this.player.view.setPosition(
                this.latestServerState.position.x,
                this.latestServerState.position.y
            );

            // Update buffer at index of latest server state
            this.stateBuffer[serverStateBufferIndex] = this.latestServerState;

            // Now re-simulate the rest of the ticks up to the current tick on the client
            let tickToProcess = this.latestServerState.tick + 1;

            while (tickToProcess < this.currentTick) {
                const bufferIndex = tickToProcess % this.bufferSize;

                // Process new movement with reconciled state
                const statePayload = this.processMovement(
                    this.inputBuffer[bufferIndex]
                );

                // Update buffer with recalculated state
                this.stateBuffer[bufferIndex] = {
                    ...statePayload,
                    tick: tickToProcess,
                };

                tickToProcess++;
            }
        }
    }

    processMovement(input: InputWithTickDto): PlayerState {
        return DefaultPlayerState;
    }

    sendToServer(inputPayload: InputWithTickDto) { }
}
