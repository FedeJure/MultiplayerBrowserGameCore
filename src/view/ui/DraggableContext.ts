import { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";
import { UiObjectView } from "./UiObjectView";

export type OnObjectDropPayload = {
  object: UiObjectView;
  dragPosition: Phaser.Math.Vector2;
};

export class DraggableContext {
  private _onObjectDrop = new Subject<OnObjectDropPayload>();
  private _onDrag = new Subject<OnObjectDropPayload>();

  private currentObject?: UiObjectView;
  private lastDragPosition?: Phaser.Math.Vector2;
  private lastContainer?: GameObjects.Container;

  constructor(private scene: Scene) {
    this.scene.input.addListener(
      "drag",
      (
        pointer: Phaser.Input.Pointer,
        object: UiObjectView,
        dragX: number,
        dragY: number
      ) => {
        this.currentObject = object;
        if (!this.lastContainer && object.container) {
          this.lastContainer = object.container;
          this.lastContainer.remove(object);
        }
        object.setPosition(pointer.position.x, pointer.position.y);
        this.lastDragPosition = pointer.position
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
        //   this.lastContainer.add(this.currentObject);
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
