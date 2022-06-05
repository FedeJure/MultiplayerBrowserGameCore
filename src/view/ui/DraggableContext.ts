import { Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { ItemCellView } from "./ItemCellView";
import { UiItemView } from "./UiItemView";

export type OnObjectDropPayload = {
  object: UiItemView;
  dragPosition: Phaser.Math.Vector2;
};

export class DraggableContext {
  private _onObjectDrop = new Subject<OnObjectDropPayload>();
  private _onDrag = new Subject<OnObjectDropPayload>();

  private currentObject?: UiItemView;
  private lastDragPosition?: Phaser.Math.Vector2;
  private lastContainer?: ItemCellView;

  constructor(private scene: Scene) {
    this.scene.input.addListener(
      "drag",
      (pointer: Phaser.Input.Pointer, object: UiItemView) => {
        this.currentObject = object;
        if (!this.lastContainer && object.container) {
          this.lastContainer = object.container;
        }
        object.setPosition(pointer.position.x, pointer.position.y);
        this.lastDragPosition = pointer.position;
        this._onDrag.next({
          object,
          dragPosition: pointer.position,
        });
      }
    );

    this.scene.input.addListener("dragend", () => {
      if (this.currentObject && this.lastDragPosition) {
        this._onObjectDrop.next({
          object: this.currentObject,
          dragPosition: this.lastDragPosition,
        });
        if (this.lastContainer) {
        }
      }
      this.currentObject = undefined;
      this.lastDragPosition = undefined;
      this.lastContainer = undefined;
    });
  }

  get OnDrag(): Observable<OnObjectDropPayload> {
    return this._onDrag;
  }
  get OnObjectDrop(): Observable<OnObjectDropPayload> {
    return this._onObjectDrop;
  }
}
