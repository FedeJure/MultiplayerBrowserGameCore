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
  delta: number,
  isServer: boolean
): Omit<Partial<PlayerState>, 'position' | 'velocity'> {
  if (state.transporting) return {};
  if (state.inLadder && view.inLadder && (input.up || view.falling)) {
    return resolveLadderMovement(state,input,stats, view,time,delta)
  }
  view.setAllowGravity(true)

  let newVelX = view.velocity.x;
  let newVelY = view.velocity.y;
  let maxRunVelocity =
    state.attacking && state.grounded ? stats.walkSpeed : stats.runSpeed;

  let canJump = state.canJump;
  let passLastTimeJump =
    state.lastTimeJump === null || state.lastTimeJump + 200 < time;
  let availableJumps =
    passLastTimeJump && view.grounded ? stats.maxJumps : state.jumpsAvailable;
  let jumping = state.jumping;
  let hasJump = false;
  if (view.grounded && input.jump) {
    // if (canJump && availableJumps > 0 && input.jump && passLastTimeJump) {
    newVelY = -stats.jumpPower;
    availableJumps--;
    canJump = false;
    jumping = true;
    hasJump = true;
  }
  if (state.grounded && jumping) jumping = false;
  if (!canJump && availableJumps > 0 && !input.jump) canJump = true;

  if (input.left || input.right || jumping) {
    const inAirFactor = !state.grounded ? 0.3 : 1;
    newVelX += +input.right * maxRunVelocity * inAirFactor;
    newVelX -= +input.left * maxRunVelocity * inAirFactor;

    newVelX = Math.sign(newVelX) * Math.min(maxRunVelocity, Math.abs(newVelX));
  }
  if (state.grounded && !input.left && !input.right) {
    newVelX = 0;
  }

  const side =
    newVelX === 0 ? state.side : newVelX > 0 ? Side.RIGHT : Side.LEFT;
  const newVelocity = {
    x: Number(newVelX.toPrecision(2)),
    y: Number(newVelY.toPrecision(2)),
  }

  view.setVelocity(newVelocity.x, newVelocity.y)
  view.lookToLeft(side === Side.LEFT)
  return {
    jumpsAvailable: availableJumps,
    canJump,
    jumping,
    inLadder: false,
    lastTimeJump: hasJump ? time : state.lastTimeJump,
  };
}

export function resolveLadderMovement(
  state: PlayerState,
  input: PlayerInputDto,
  stats: PlayerStats,
  view: PlayerView,
  time: number,
  delta: number
) {
  view.setAllowGravity(false)
  const directionVector = new Phaser.Math.Vector2(
    input.left ? -1 : input.right ? 1 : 0,
    input.up ? -1 : input.down ? 1 : 0
  );

  const velocity = directionVector.normalize().scale(stats.walkSpeed);
  view.setVelocity(velocity.x, velocity.y)
  return {
    inLadder: true,
    side:
      directionVector.x === 0
        ? state.side
        : directionVector.x > 0
        ? Side.RIGHT
        : Side.LEFT,
  };
}
