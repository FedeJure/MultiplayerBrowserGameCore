import { DefaultEntityMovement } from "../../entity/DefaultMovement";
import { Side } from "../../side";
import { ControllablePlayer } from "../players/controllablePlayer";

export class PlayerMovement extends DefaultEntityMovement {
  protected player: ControllablePlayer;
  init(player: ControllablePlayer) {
    this.player = player;
    super.init(player);
  }
  private lastTimeJump: number | null = null;
  update(time: number, delta: number) {
    if (this.player.state.transporting) return;
    if (
      this.player.view.inLadder &&
      (this.player.input.up || this.player.view.falling)
    )
      this.player.updateState({ inLadder: true });
    if (this.player.state.inLadder && this.player.view.inLadder)
      this.resolveLadderMovement(time, delta);
    else this.updateNewStateWithNormalMovement(time, delta);
    super.update(time, delta);
  }

  protected updateNewStateWithNormalMovement(time: number, delta: number) {
    this.player.updateState(this.resolveNormalMovement(time, delta));
  }

  protected updateNewStateWithLadderMovement(time: number, delta: number) {
    this.player.updateState(this.resolveLadderMovement(time, delta));
  }

  protected resolveLadderMovement(time: number, delta: number) {
    this.player.view.setAllowGravity(false);

    const directionVector = new Phaser.Math.Vector2(
      this.player.input.left ? -1 : this.player.input.right ? 1 : 0,
      this.player.input.up ? -1 : this.player.input.down ? 1 : 0
    );

    const velocity = directionVector
      .normalize()
      .scale(this.player.stats.walkSpeed);
    return {
      velocity: { x: velocity.x, y: velocity.y },
      position: this.player.view.positionVector,
      side:
        directionVector.x === 0
          ? this.player.state.side
          : directionVector.x > 0
          ? Side.RIGHT
          : Side.LEFT,
    };
  }

  protected resolveNormalMovement(time: number, delta: number) {
    this.player.view.setAllowGravity(true);
    const { state, input, view } = this.player;
    let newVelX = this.player.view.velocity.x;
    let newVelY = this.player.view.velocity.y;
    let maxRunVelocity =
      state.attacking && view.grounded
        ? this.player.stats.walkSpeed
        : this.player.stats.runSpeed;

    let canJump = state.canJump;
    let passLastTimeJump =
      this.lastTimeJump === null || this.lastTimeJump + 200 < time;
    let availableJumps =
      passLastTimeJump && view.grounded
        ? this.player.stats.maxJumps
        : state.jumpsAvailable;
    let jumping = state.jumping;
    if (canJump && availableJumps > 0 && input.jump && passLastTimeJump) {
      newVelY = -this.player.stats.jumpPower * delta;
      availableJumps--;
      canJump = false;
      jumping = true;
      this.lastTimeJump = time;
    }
    if (view.grounded && jumping) jumping = false;
    if (!canJump && availableJumps > 0 && !input.jump) canJump = true;

    if (input.left || input.right || jumping) {
      const inAirFactor = !view.grounded ? 0.3 : 1;
      newVelX += +input.right * maxRunVelocity * delta * inAirFactor;
      newVelX -= +input.left * maxRunVelocity * delta * inAirFactor;

      newVelX =
        Math.sign(newVelX) * Math.min(maxRunVelocity, Math.abs(newVelX));
    }
    if (view.grounded && !input.left && !input.right) {
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
      position: this.player.view.positionVector,
      canJump,
      side,
      jumping,
      grounded: this.player.view.grounded,
      inLadder: false,
    };
  }
}
