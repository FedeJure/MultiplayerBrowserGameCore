import { PhaserPlayerView } from "./phaserPlayerView";
import { Scene } from "phaser";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";

export class ServerPlayerView extends PhaserPlayerView {
  private readonly spine: SpineGameObject;
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
}
