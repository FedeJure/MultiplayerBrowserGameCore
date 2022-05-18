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
    super(view, x, y, height, width, combatCollisionResolver);
    this.setName("Player View");
  }

  startFollowWithCam(): void {}
}
