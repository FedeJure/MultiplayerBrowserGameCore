import { Item } from "../../domain/items/item";
import { AssetLoader } from "../AssetLoader";
import interact from "interactjs";
import { ItemType } from "../../domain/items/itemType";
import { Subject } from "rxjs";

export class HtmlCellView {
  readonly element: HTMLDivElement;
  private img: HTMLImageElement | null = null;
  private _onItemStartDrag = new Subject<void>();
  private _onItemDropped = new Subject<void>();

  constructor(
    size: number,
    acceptedTypes?: ItemType[],
    private preventsDrag: boolean = false
  ) {
    this.element = document.createElement("div");
    this.setSize(size);
    this.element.style.margin = "1px";
    this.element.style.backgroundColor = "#b08e6b";

    if (!preventsDrag) {
      interact(this.element).dropzone({
        accept: ({ draggableElement }) => {
          const rawTypes = draggableElement.getAttribute("types");
          if (!rawTypes) return false;
          const types = rawTypes.split(",");
          return acceptedTypes
            ? acceptedTypes.some((type) => types.includes(type))
            : true;
        },
        overlap: "center",
        ondrop: (event) => {
          this._onItemDropped.next();
          if (!this.img || event.relatedTarget === this.img) {
            this.setExistentItem(event.relatedTarget);
          }
        },
      });
    }
  }

  setSize(size: number) {
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
  }

  dragMoveListener = (event) => {
    this.img = null;
    var target = event.target;
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  };

  setExistentItem(item: HTMLImageElement) {
    this.img = item;
    this.element.appendChild(item);
    this.img.style.transform = "";
    this.img.style.width = "100%";
    this.img.style.height = "100%";
    item.setAttribute("data-x", "0");
    item.setAttribute("data-y", "0");
    if (!this.preventsDrag) {
      interact(this.img).unset();
      interact(this.img).draggable({
        enabled: true,
        onend: (event) => {
          this.setExistentItem(event.currentTarget);
        },
        onmove: this.dragMoveListener,
        onstart: () => this._onItemStartDrag.next(),
      });
    }
  }

  setItem(item: Item) {
    if (!this.isEmpty) throw new Error("Cell not empty");
    const img = document.createElement("img");
    img.setAttribute("types", item.types.join(","));
    img.src = AssetLoader.resolveAssetPath(item.icon);
    this.setExistentItem(img);
    img.dataset.itemId = item.id;
  }

  clear() {
    if (this.isEmpty) return;
    this.img?.remove();
    this.img = null;
  }

  get isEmpty() {
    return this.img === null;
  }

  get onItemDropped() {
    return this._onItemDropped.asObservable();
  }
  get onItemStartDrag() {
    return this._onItemStartDrag.asObservable();
  }

  setSelected(selected: boolean) {
    if (selected) {
      this.element.style.border = "2px solid #9ecaed";
      this.element.style.margin = "-1px";
      this.element.style.boxShadow = "0 0 10px #9ecaed";
    } else {
      this.element.style.margin = "1px";
      this.element.style.border = "none";
      this.element.style.boxShadow = "none";
    }
  }
}
