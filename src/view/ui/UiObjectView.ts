import { GameObjects, Scene } from "phaser";
import { CellView } from "./CellView";
import { ObjectDetailView } from "./objectDetailView";
import { UiObject } from "./UiObject";

export class UiObjectView extends GameObjects.Image {
  private detailView: ObjectDetailView;
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
    this.detailView = new ObjectDetailView(scene);
    this.addListener("dragstart", () => {
      this.detailView.setVisible(false)
    })
    this.addListener("pointerover", (pointer, x, y) => {
      this.detailView.setObject(this.uiObject);
      this.detailView.setVisible(true);

      this.detailView.setPosition(
        pointer.position.x - x,
        pointer.position.y - y / 2
      );
    });
    this.addListener("pointerout", () => {
      this.detailView.setVisible(false);
    });
  }

  get container() {
    return this.parentContainer as CellView | undefined;
  }
}
