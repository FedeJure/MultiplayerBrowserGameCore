import { GameObjects } from "phaser";
import { Delegator } from "../../delegator";

export class AnimatedDecorativeObjectDelegator implements Delegator {
    private view : SpineGameObject
    constructor (view: GameObjects.GameObject) {
        this.view = view as unknown as SpineGameObject
    }
    init(): void {
        this.view.setAnimation(0, 'animation', true)
    }
    stop(): void {
    }
    update(time: number, delta: number): void {
    }

}