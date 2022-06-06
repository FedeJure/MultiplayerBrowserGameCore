import { GameObjects, Scene } from "phaser";
import { Item } from "../../domain/items/item";
import { ItemCellView } from "./ItemCellView";
import { ItemDetailView } from "./ItemDetailView";

export class UiItemView extends GameObjects.Image {
  private detailView: ItemDetailView;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    texture: string,
    public readonly item: Item
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this).setOrigin(0.5, 0.5).setDisplaySize(width, height);
    this.setInteractive();
    this.scene.input.setDraggable(this);
    this.detailView = new ItemDetailView(scene);
    this.addListener("dragstart", () => {
      this.detailView.setVisible(false)
    })
    this.addListener("pointerover", (pointer, x, y) => {
      this.detailView.setObject(this.item);
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
    return this.parentContainer as ItemCellView | undefined;
  }
}
