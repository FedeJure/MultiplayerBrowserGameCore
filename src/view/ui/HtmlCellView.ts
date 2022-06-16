import { Item } from "../../domain/items/item";
import { AssetLoader } from "../AssetLoader";
import interact from "interactjs";
import { ItemType } from "../../domain/items/itemType";

export class HtmlCellView {
  readonly element: HTMLDivElement;
  private img: HTMLImageElement | null = null;
  constructor(size: number, acceptedTypes: ItemType[]) {
    this.element = document.createElement("div");
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
    this.element.style.margin = "1px";
    this.element.style.backgroundColor = '#b08e6b'

    interact(this.element).dropzone({
        accept: ({draggableElement}) => {
            const rawTypes = draggableElement.getAttribute('types')
            if (!rawTypes) return false
            const types = rawTypes.split(',')
            return acceptedTypes.some(type => types.includes(type))
        },
      overlap: 'center',
      ondrop: (event) => {
        if (!this.img || event.relatedTarget === this.img) {
          this.setExistentItem(event.relatedTarget);
        }
      },
    });
  }

  dragMoveListener = (event) => {
    this.img = null
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
    item.setAttribute("data-x", '0');
    item.setAttribute("data-y", '0');
    interact(this.img).unset();
    interact(this.img).draggable({
      enabled: true,
      onend: (event) => {
        this.setExistentItem(event.currentTarget);
      },
      onmove: this.dragMoveListener,
    });
  }

  setItem(item: Item) {
    if (!this.isEmpty) throw new Error("Cell not empty");

    const img = document.createElement("img");
    img.setAttribute("types", item.types.join(','))
    img.src = AssetLoader.resolveAssetPath(item.icon);
    this.setExistentItem(img);
  }

  get isEmpty() {
    return this.img === null;
  }
}
