import { Physics } from "phaser";
import { PlayerView } from "../../domain/playerView";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";
import { PhaserEntityView } from "../entity/phaserEntityView";
import { IsInsidePropertyOrRemove } from "../utils";
import { Ladder } from "../../domain/environment/ladder";
import { ExistentDepths } from "../existentDepths";

export class PhaserPlayerView extends PhaserEntityView implements PlayerView {
  constructor(
    readonly view: Physics.Arcade.Sprite,
    x: number,
    y: number,
    height: number,
    width: number,
    public readonly combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    super(view, x, y, height, width, combatCollisionResolver);
    this.setName("Player View");
    this.setDepth(ExistentDepths.PLAYERS);
  }
  get inLadder() {
    return IsInsidePropertyOrRemove<Ladder>(this, "ladder") !== undefined;
  }

}
