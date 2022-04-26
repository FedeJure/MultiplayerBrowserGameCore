import { Side } from "../../side";
import { DefaultConfiguration } from "../playerConfiguration";
import { LocalClientPlayer } from "../players/localClientPlayer";
import { ServerPlayer } from "../players/serverPlayer";

export class MovementSystem {
  processMovement(player: LocalClientPlayer | ServerPlayer, deltaTime: number) {
    const { state, input } = player;
    let newVelX = player.view.velocity.x;
    let newVelY = player.view.velocity.y;
    let velocity = 0.05;
    let maxRunVelocity =
      DefaultConfiguration.runVelocity *
      (state.attacking && state.grounded ? 0.5 : 1);
    let availableJumps = state.grounded
      ? DefaultConfiguration.initialJumps
      : state.jumpsAvailable;
    let canJump = state.canJump;
    let jumping = state.jumping;

    if (canJump && availableJumps > 0 && input.jump) {
      newVelY = -DefaultConfiguration.jumpVelocity * deltaTime;
      availableJumps--;
      canJump = false;
      jumping = true;
    }
    if (state.grounded && jumping) jumping = false;
    if (!canJump && availableJumps > 0 && !input.jump) canJump = true;

    if (input.left || input.right || jumping) {
      const inAirFactor = jumping ? 0.3 : 1;
      newVelX += +input.right * velocity * deltaTime * inAirFactor;
      newVelX -= +input.left * velocity * deltaTime * inAirFactor;

      newVelX =
        Math.sign(newVelX) * Math.min(maxRunVelocity, Math.abs(newVelX));
    }
    if (state.grounded && !input.left && !input.right) {
      newVelX = 0;
    }

    const side =
      newVelX === 0 ? state.side : newVelX > 0 ? Side.RIGHT : Side.LEFT;

    player.updateState({
      velocity: {
        x: Number(newVelX.toPrecision(2)),
        y: Number(newVelY.toPrecision(2)),
      },
      jumpsAvailable: availableJumps,
      position: player.view.positionVector,
      canJump,
      side,
      jumping,
    });
  }
}
