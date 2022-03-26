import { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { Item } from "../domain/items/item";

type ItemDropPayload = {
  item: Item;
  gameObject: GameObjects.Image;
  dragPosition: Phaser.Math.Vector2;
}

export class InventoryItemView extends GameObjects.Container {
  private _onItemDrop = new Subject<ItemDropPayload>();
  private _onMouseOver = new Subject<null>();
  private _onDragStart = new Subject<null>();
  private item?: GameObjects.Image;
  private lastDragPosition: Phaser.Math.Vector2 | null = null
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, []);
    const background = scene.add
      .image(0, 0, "inventoryItemBackground")
      .setDisplaySize(InventoryItemView.SIZE, InventoryItemView.SIZE)
      .setOrigin(0, 0);
    this.add(background);
    background.setInteractive();
    background.on("pointerover", () => this._onMouseOver.next(null));
  }

  public static get SIZE() {
    return 50;
  }

  public setItem(item: Item) {
    const size = InventoryItemView.SIZE * 0.88;
    this.item = this.scene.add
      .image(InventoryItemView.SIZE / 2, InventoryItemView.SIZE / 2, item.icon)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(size, size);

    this.item.setInteractive();
    this.item.on("dragend", () => {
      if (!this.lastDragPosition) return
      this._onItemDrop.next({
        item,
        gameObject: this.item!,
        dragPosition: this.lastDragPosition
      });
    });
    this.item.on("drag", (pointe, dragX, dragY) => {
      this.item?.setPosition(dragX, dragY)
      this.lastDragPosition = new Phaser.Math.Vector2(dragX, dragY)

    });

    this.item.on("dragstart", (pointer) => {
      this._onDragStart.next(null)
    });

    this.scene.input.setDraggable(this.item);

    this.add(this.item);
    this.bringToTop(this.item)
  }

  public removeItem() {
    if (this.item) this.remove(this.item, true);
  }

  public resetItemState() {
    if (this.item)
      this.item.setPosition(
        InventoryItemView.SIZE / 2,
        InventoryItemView.SIZE / 2
      );
  }

  public get isEmpty() {
    return new Boolean(!this.item);
  }

  public get onItemDrop(): Observable<ItemDropPayload> {
    return this._onItemDrop;
  }

  public get onMouseOn(): Observable<unknown> {
    return this._onMouseOver;
  }
  public get onDragStart(): Observable<unknown> {
    return this._onDragStart;
  }
}
