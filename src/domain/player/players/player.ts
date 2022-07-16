import { Entity } from "../../entity/entity";
import { PlayerView } from "../../playerView";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";
import { PlayerStats } from "../playerStats";

export class Player extends Entity<
  PlayerInfo,
  PlayerState,
  PlayerView,
  PlayerStats
> {
  postUpdate(): void {
    this.updateState({
      position: this.view.positionVector,
      velocity: this.view.velocity,
      side: this.view.side,
      grounded: this.view.grounded,
      inLadder: this.view.inLadder,
    });
    this._animations.update();
  }
}
