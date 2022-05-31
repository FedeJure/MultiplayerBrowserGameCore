import Phaser, { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { UiObject } from "./ui/UiObject";


type OnItemDropPayload  = {
  object: UiObject;
  gameObject: GameObjects.Image;
  dragPosition: Phaser.Math.Vector2;
}


export class GenericObjectCellView extends GameObjects.Container {

  private _onItemDrop = new Subject<OnItemDropPayload>();
  private _onDragStart = new Subject<null>();
  private _onMouseOver = new Subject<UiObject>();
  private _onMouseExit = new Subject<null>();

  private item?: GameObjects.Image;
  private lastDragPosition: Phaser.Math.Vector2 | null = null;

  constructor(
    public readonly id: number,
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, []);
    this.width = width
    this.height = height
    const background = scene.add
      .image(0, 0, "inventoryItemBackground")
      .setDisplaySize(width, height)
      .setOrigin(0, 0);
    this.add(background);
  }
  
  public setObject(item: UiObject) {
    if (this.item) throw new Error("Item cell not empty");
    this.item = this.scene.add
      .image(this.width / 2, this.height / 2, item.icon)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.width * 0.88, this.height * 0.88);

    this.item.setInteractive();

    this.item.on("drag", (pointe, dragX, dragY) => {
      this.item?.setPosition(dragX, dragY);
      this.lastDragPosition = new Phaser.Math.Vector2(dragX, dragY);
    });

    this.item.on("dragstart", (pointer) => {
      this._onDragStart.next(null);
    });

    this.item.on("dragend", () => {
      if (!this.lastDragPosition) return;
      this._onItemDrop.next({
        object: item,
        gameObject: this.item!,
        dragPosition: this.lastDragPosition,
      });
    });

    this.item.on("pointerover", () => {
      this._onMouseOver.next(item);
    });

    this.item.on("pointerout", () => {
      this._onMouseExit.next(null);
    });

    this.scene.input.setDraggable(this.item);

    this.add(this.item);
    this.bringToTop(this.item);
  }

  public removeItem() {
    if (this.item) {
      this.remove(this.item, true);
      this.item = undefined;
    }
  }

  public resetItemState() {
    if (this.item)
      this.item.setPosition(
        this.width / 2,
        this.height / 2
      );
  }

  public get isEmpty() {
    return new Boolean(!this.item);
  }

  public get onItemDrop(): Observable<OnItemDropPayload> {
    return this._onItemDrop;
  }

  public get onDragStart(): Observable<unknown> {
    return this._onDragStart;
  }

  public get onMouseOver(): Observable<UiObject> {
    return this._onMouseOver;
  }

  public get onMouseExit(): Observable<unknown> {
    return this._onMouseExit;
  }
}
