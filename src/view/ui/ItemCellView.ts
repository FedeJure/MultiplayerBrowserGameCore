import { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { UiItemView } from "./UiItemView";
import { ItemType } from "../../domain/items/itemType";
import { Item } from "../../domain/items/item";

export class ItemCellView extends GameObjects.Container {
  private _onItemSaved = new Subject<Item>();
  private _onItemRemoved = new Subject<Item>();

  private object?: GameObjects.Image;
  private isTemporallyRemoved: boolean;

  constructor(
    public readonly id: number,
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    private allowedTypes: ItemType[] = [],
    title?: string
  ) {
    super(scene, x, y, []);
    this.width = width;
    this.height = height;
    const background = scene.add
      .image(0, 0, "inventoryItemBackground")
      .setDisplaySize(width, height)
      .setOrigin(0, 0);
    this.add(background);
    if (title) {
      const text = scene.add.text(0, height, title, {
        color: "#808080",
        wordWrap: { width: width },
      });
      text.setPosition(width / 2 - text.width / 2, text.y);
      this.add(text);
    }
  }

  public setExistingObject(object: UiItemView) {
    if (this.object && this.object !== object)
      throw new Error("Item cell not empty");
    if (this.object === object && this.isTemporallyRemoved) {
      this.isTemporallyRemoved = false;
    } else {
      this._onItemSaved.next(object.item);
    }

    this.object = object;
    this.add(this.object);
    this.bringToTop(this.object);
    this.resetObjectState();
  }

  public removeObjectTemporally() {
    if (!this.isTemporallyRemoved && this.object) {
      this.remove(this.object);
      this.isTemporallyRemoved = true;
    }
  }

  public removeObject() {
    if (this.object) {
      this.remove(this.object);
      this.object = undefined;
      this.isTemporallyRemoved = false;
    }
  }

  public resetObjectState() {
    if (this.object) this.object.setPosition(this.width / 2, this.height / 2);
  }

  public get isEmpty() {
    return new Boolean(!this.object);
  }

  public allowType(type: ItemType) {
    return this.allowedTypes.includes(type);
  }

  public get onItemSaved(): Observable<Item> {
    return this._onItemSaved;
  }

  public get onItemRemoved(): Observable<Item> {
    return this._onItemRemoved;
  }
}
