import { Scene } from "phaser";
import { Item } from "../../domain/items/item";
import { HtmlElement } from "./HtmlElement";
import interact from "interactjs";

export class HtmlDragAndDropContext extends HtmlElement {
  private item: Item | null = null;
  constructor(scene: Scene) {
    super(
      scene,
      "DragAndDropContext",
      document.getElementById("gameContainer") as HTMLDivElement
    );
  }

  addDropZone(zone: HTMLElement) {
    interact(zone)
      .dropzone({
        ondrop: (event) => {
          console.log(event);
        },
      })
      .on("dropactivate", function (event) {
        event.target.classList.add("drop-activated");
      });
  }
}
