import { GameObjects, Scene } from "phaser";
import { CellView } from "./CellView";
import { UiObject } from "./UiObject";

export class UiObjectView extends GameObjects.Image {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    texture: string,
    public readonly uiObject: UiObject
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this).setOrigin(0.5, 0.5).setDisplaySize(width, height);
    this.setInteractive();
    this.scene.input.setDraggable(this);
  }

  get container() {
    return this.parentContainer as CellView | undefined
  }
}
