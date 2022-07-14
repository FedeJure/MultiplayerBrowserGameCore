import { PlayerInputDto } from "../../../infrastructure/dtos/playerInputDto";
import { PlayerView } from "../../playerView";
import { Side } from "../../side";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export function resolveMovement(
  state: PlayerState,
  input: PlayerInputDto,
  stats: PlayerStats,
  view: PlayerView,
  time: number,
  delta: number
): Partial<PlayerState> {
  let newVelX = view.velocity.x;
  let newVelY = view.velocity.y;
  let maxRunVelocity =
    state.attacking && state.grounded ? stats.walkSpeed : stats.runSpeed;

  let canJump = state.canJump;
  let passLastTimeJump =
    state.lastTimeJump === null ||  state.lastTimeJump + 200 < time;
  let availableJumps =
    passLastTimeJump && state.grounded ? stats.maxJumps : state.jumpsAvailable;
  let jumping = state.jumping;
  let hasJump = false;
  if (canJump && availableJumps > 0 && input.jump && passLastTimeJump) {
    newVelY = -stats.jumpPower * delta;
    availableJumps--;
    canJump = false;
    jumping = true;
    hasJump = true;
  }
  if (state.grounded && jumping) jumping = false;
  if (!canJump && availableJumps > 0 && !input.jump) canJump = true;

  if (input.left || input.right || jumping) {
    const inAirFactor = !state.grounded ? 0.3 : 1;
    newVelX += +input.right * maxRunVelocity * delta * inAirFactor;
    newVelX -= +input.left * maxRunVelocity * delta * inAirFactor;

    newVelX = Math.sign(newVelX) * Math.min(maxRunVelocity, Math.abs(newVelX));
  }
  if (state.grounded && !input.left && !input.right) {
    newVelX = 0;
  }

  const side =
    newVelX === 0 ? state.side : newVelX > 0 ? Side.RIGHT : Side.LEFT;
  return {
    velocity: {
      x: Number(newVelX.toPrecision(2)),
      y: Number(newVelY.toPrecision(2)),
    },
    jumpsAvailable: availableJumps,
    position: view.positionVector,
    canJump,
    side,
    jumping,
    grounded: view.grounded,
    inLadder: false,
    lastTimeJump: hasJump ? time : state.lastTimeJump,
  };
}
