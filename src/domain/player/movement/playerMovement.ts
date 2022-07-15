import { DefaultEntityMovement } from "../../entity/DefaultMovement";
import { ControllablePlayer } from "../players/controllablePlayer";
import { resolveLadderMovement, resolveMovement } from "./resolveMovement";

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
    this.player.updateState({
      position: this.player.view.positionVector,
      velocity: this.player.view.velocity
    })
    super.update(time, delta);
  }

  resolveLadderMovement(time: number, delta: number) {
    this.player.view.setAllowGravity(false);
    this.player.updateState(
      resolveLadderMovement(
        this.player.state,
        this.player.input,
        this.player.stats,
        this.player.view,
        Date.now(),
        delta
      )
    );

  }
  resolveNormalMovement(time: number, delta: number) {
    this.player.view.setAllowGravity(true); // keep here
    this.player.updateState(
      resolveMovement(
        this.player.state,
        this.player.input,
        this.player.stats,
        this.player.view,
        Date.now(),
        delta
      )
    );
  }
}
