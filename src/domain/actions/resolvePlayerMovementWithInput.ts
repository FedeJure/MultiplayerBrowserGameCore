import { IPlayerView } from "../playerView";
import { DefaultConfiguration } from "../player/playerConfiguration";
import { PlayerInput } from "../player/playerInput";
import { PlayerState } from "../player/playerState";
import { Side } from "../side";

export class ResolvePlayerMovementWithInputs {
  constructor() {}

  execute(
    input: PlayerInput,
    view: IPlayerView,
    state: PlayerState,
    deltaTime: number
  ): PlayerState {
    let newVelX = view.velocity.x;
    let newVelY = view.velocity.y;
    let velocity = 0.05;
    let maxRunVelocity = DefaultConfiguration.runVelocity;
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

    return {
      ...state,
      velocity: {
        x: Number(newVelX.toPrecision(2)),
        y: Number(newVelY.toPrecision(2)),
      },
      jumpsAvailable: availableJumps,
      position: view.position,
      canJump,
      side,
      jumping,
    };
  }

  processJump() {}
}
