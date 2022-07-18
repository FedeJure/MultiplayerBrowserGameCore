import { PhaserPlayerView } from "./phaserPlayerView";
import { Scene } from "phaser";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";
import { IsInsidePropertyOrRemove } from "../utils";
import { Exit } from "../../domain/environment/exit";

export class ServerPlayerView extends PhaserPlayerView {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    const sprite = scene.physics.add.sprite(x, y, "");
    super(sprite, x, y, height, width, combatCollisionResolver);
  }

  get currentExit() {
    return IsInsidePropertyOrRemove<Exit>(this, "exit")
  }
}
