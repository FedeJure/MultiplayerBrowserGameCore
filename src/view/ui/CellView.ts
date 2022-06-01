import Phaser, { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { UiObject } from "./UiObject";

type OnObjectDropPayload = {
  object: UiObject;
  gameObject: GameObjects.Image;
  dragPosition: Phaser.Math.Vector2;
};

export class GenericObjectCellView extends GameObjects.Container {
  private _onObjectDrop = new Subject<OnObjectDropPayload>();
  private _onDragStart = new Subject<null>();
  private _onMouseOver = new Subject<UiObject>();
  private _onMouseExit = new Subject<null>();

  private object?: GameObjects.Image;
  private lastDragPosition: Phaser.Math.Vector2 | null = null;

  constructor(
    public readonly id: number,
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
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
      const text = scene.add.text(0, height, title, { color: "#808080" });
      text.setPosition(width / 2 - text.width / 2, text.y);
      this.add(text);
    }
  }

  public setObject(object: UiObject) {
    if (this.object) throw new Error("Item cell not empty");
    this.object = this.scene.add
      .image(this.width / 2, this.height / 2, object.icon)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.width * 0.88, this.height * 0.88);

    this.object.setInteractive();

    this.object.on("drag", (pointe, dragX, dragY) => {
      this.object?.setPosition(dragX, dragY);
      this.lastDragPosition = new Phaser.Math.Vector2(dragX, dragY);
    });

    this.object.on("dragstart", (pointer) => {
      this._onDragStart.next(null);
    });

    this.object.on("dragend", () => {
      if (!this.lastDragPosition) return;
      this._onObjectDrop.next({
        object: object,
        gameObject: this.object!,
        dragPosition: this.lastDragPosition,
      });
    });

    this.object.on("pointerover", () => {
      this._onMouseOver.next(object);
    });

    this.object.on("pointerout", () => {
      this._onMouseExit.next(null);
    });

    this.scene.input.setDraggable(this.object);

    this.add(this.object);
    this.bringToTop(this.object);
  }

  public removeObject() {
    if (this.object) {
      this.remove(this.object, true);
      this.object = undefined;
    }
  }

  public resetObjectState() {
    if (this.object) this.object.setPosition(this.width / 2, this.height / 2);
  }

  public get isEmpty() {
    return new Boolean(!this.object);
  }

  public get onObjectDrop(): Observable<OnObjectDropPayload> {
    return this._onObjectDrop;
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
