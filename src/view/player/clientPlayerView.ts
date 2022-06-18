import {  Scene } from "phaser";

import { SpinePhaserEntityView } from "../entity/spinePhaserEntityView";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";

export class ClientPlayerView extends SpinePhaserEntityView {

  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string,
    showHud: boolean,
    public readonly combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    super(scene, x, y, height, width, name, undefined, showHud);
  }
}
