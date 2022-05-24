import { Side } from "../../side";
import { ControllablePlayer } from "../players/controllablePlayer";

export class MovementSystem {
  private lastTimeJump: number | null = null;
  processMovement(player: ControllablePlayer, time: number, deltaTime: number) {
    const { state, input } = player;
    let newVelX = player.view.velocity.x;
    let newVelY = player.view.velocity.y;
    let maxRunVelocity =
      player.stats.runSpeed * (state.attacking && state.grounded ? 0.5 : 1);

    let canJump = state.canJump;
    let passLastTimeJump =
      this.lastTimeJump === null || this.lastTimeJump + 200 < time;
    let availableJumps =
      passLastTimeJump && state.grounded
        ? player.stats.maxJumps
        : state.jumpsAvailable;
    let jumping = state.jumping;
    if (canJump && availableJumps > 0 && input.jump && passLastTimeJump) {
      newVelY = -player.stats.jumpPower * deltaTime;
      availableJumps--;
      canJump = false;
      jumping = true;
      this.lastTimeJump = time;
    }
    if (state.grounded && jumping) jumping = false;
    if (!canJump && availableJumps > 0 && !input.jump) canJump = true;

    if (input.left || input.right || jumping) {
      const inAirFactor = !state.grounded ? 0.3 : 1;
      newVelX += +input.right * maxRunVelocity * deltaTime * inAirFactor;
      newVelX -= +input.left * maxRunVelocity * deltaTime * inAirFactor;

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
      grounded: player.view.grounded,
    });
  }
}
