import { getDistance } from "../../../view/utils";
import { Vector } from "../../vector";
import { ServerPlayerInput } from "../serverPlayerInput";
import { PlayerMovement } from "./playerMovement";

export class ServerPlayerMovement extends PlayerMovement {
  private clientRequestedPosition: Vector | undefined;
  constructor(input: ServerPlayerInput) {
    super();
    input.onClientPositionReceived.subscribe((position) => {
      this.clientRequestedPosition = position;
    });
  }

  override updateNewStateWithLadderMovement(time: number, delta: number): void {
    const calculatedState = this.resolveLadderMovement(time, delta);
    if (!this.clientRequestedPosition) {
      this.player.updateState(calculatedState);
      return;
    }
    const distanceBetweenRequested = getDistance(
      calculatedState.position,
      this.clientRequestedPosition
    );
    console.log(distanceBetweenRequested)
    if (distanceBetweenRequested < 50)
      this.player.updateState({
        ...calculatedState,
        position: this.clientRequestedPosition,
      });
  }

  override updateNewStateWithNormalMovement(time: number, delta: number): void {
    const calculatedState = this.resolveNormalMovement(time, delta);
    if (!this.clientRequestedPosition) {
      this.player.updateState(calculatedState);
      return;
    }
    const distanceBetweenRequested = getDistance(
      calculatedState.position,
      this.clientRequestedPosition
    );
    console.log(distanceBetweenRequested)
    if (distanceBetweenRequested < 50)
      this.player.updateState({
        ...calculatedState,
        position: this.clientRequestedPosition,
      });
  }
}
