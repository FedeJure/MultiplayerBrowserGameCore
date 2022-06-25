import { Scene } from "phaser";
import { EntityIngameHud } from "../entity/entityIngameHud";
import { SpinePhaserEntityView } from "../entity/spinePhaserEntityView";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";

export class SpinePlayerView extends SpinePhaserEntityView {
    public readonly inLadder: boolean = false
    constructor(
        scene: Scene,
        x: number,
        y: number,
        height: number,
        width: number,
        name: string,
        texture: string = "hero",
        public readonly combatCollisionResolver: PhaserCombatCollisionResolver
    ) {
        super(scene,x,y,height,width, name, texture)
        this.hud = new EntityIngameHud(scene, 0, -height, height, 50, false);
        this.hud.setDisplayName(name);
        this.add(this.hud)
    }
}