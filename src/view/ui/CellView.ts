import { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { UiObjectView } from "./UiObjectView";
import { UiObject } from "./UiObject";

export class CellView extends GameObjects.Container {
  private _onMouseOver = new Subject<UiObject>();
  private _onMouseExit = new Subject<void>();

  private object?: GameObjects.Image;

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
      const text = scene.add.text(0, height, title, {
        color: "#808080",
        wordWrap: { width: width },
      });
      text.setPosition(width / 2 - text.width / 2, text.y);
      this.add(text);
    }
  }

  public setExistingObject(object: UiObjectView) {
    if (this.object && this.object !== object)
      throw new Error("Item cell not empty");
    this.object = object
    this.add(this.object);
    this.bringToTop(this.object);
    this.resetObjectState()
  }

  public setObject(object: UiObject) {
    if (this.object) throw new Error("Item cell not empty");
    this.object = new UiObjectView(
      this.scene,
      this.width / 2,
      this.height / 2,
      this.width * 0.88,
      this.height * 0.88,
      object.icon,
      object
    );

    this.object.on("pointerover", () => {
      this._onMouseOver.next(object);
    });

    this.object.on("pointerout", () => {
      this._onMouseExit.next();
    });

    this.add(this.object);
    this.bringToTop(this.object);
  }

  public removeObject() {
    if (this.object) {
      this.remove(this.object);
      this.object = undefined;
    }
  }

  public resetObjectState() {
    if (this.object) this.object.setPosition(this.width / 2, this.height / 2);
  }

  public get isEmpty() {
    return new Boolean(!this.object);
  }


  public get onMouseOver(): Observable<UiObject> {
    return this._onMouseOver;
  }

  public get onMouseExit(): Observable<unknown> {
    return this._onMouseExit;
  }
}
