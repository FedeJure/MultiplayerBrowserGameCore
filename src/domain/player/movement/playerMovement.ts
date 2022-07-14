import { DefaultEntityMovement } from "../../entity/DefaultMovement";
import { Side } from "../../side";
import { ControllablePlayer } from "../players/controllablePlayer";
import { resolveMovement } from "./resolveMovement";

export class PlayerMovement extends DefaultEntityMovement {
  private player: ControllablePlayer;
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
    else this.resolveNormalMovement(time, delta);
    super.update(time, delta);
  }

  resolveLadderMovement(time: number, delta: number) {
    this.player.view.setAllowGravity(false);

    const directionVector = new Phaser.Math.Vector2(
      this.player.input.left ? -1 : this.player.input.right ? 1 : 0,
      this.player.input.up ? -1 : this.player.input.down ? 1 : 0
    );

    const velocity = directionVector
      .normalize()
      .scale(this.player.stats.walkSpeed);
    this.player.updateState({
      velocity: { x: velocity.x, y: velocity.y },
      position: this.player.view.positionVector,
      side:
        directionVector.x === 0
          ? this.player.state.side
          : directionVector.x > 0
          ? Side.RIGHT
          : Side.LEFT,
    });
  }
  resolveNormalMovement(time: number, delta: number) {
    this.player.view.setAllowGravity(true); // keep here

    this.player.updateState(
      resolveMovement(
        this.player.state,
        this.player.input,
        this.player.stats,
        this.player.view,
        time,
        delta
      )
    );
  }
}
