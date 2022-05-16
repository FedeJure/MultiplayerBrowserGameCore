import { Physics } from "phaser";
import { PlayerView } from "../../domain/playerView";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";
import { PhaserEntityView } from "../entity/phaserEntityView";

export class PhaserPlayerView extends PhaserEntityView implements PlayerView {
  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number,
    public readonly combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    super(view, x, y, height, width);
    this.setName("Player View");
  }
  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this, false, 0.1, 0.1);
  }
}
