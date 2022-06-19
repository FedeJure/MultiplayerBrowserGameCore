import { GameObjects, Scene } from "phaser";
import { Loot } from "../../domain/loot/loot";

export class PhaserClientLootView extends GameObjects.Image {
    constructor(scene: Scene, loot: Loot) {
        super(scene, loot.position.x, loot.position.y, "loot")
        this.setDisplaySize(10, 15)
        scene.physics.add.existing(this);
        scene.add.existing(this)
    }
}