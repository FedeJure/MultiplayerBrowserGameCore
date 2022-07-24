import interact from "interactjs";
import { Scene } from "phaser";
import { Subject } from "rxjs";
import { InventoryView } from "../../domain/inventory/inventoryView";
import { Item } from "../../domain/items/item";
import { ItemType } from "../../domain/items/itemType";
import { ClientPlayerInput } from "../../domain/player/playerInput";
import { HtmlCellView } from "./HtmlCellView";
import { HtmlElement } from "./HtmlElement";
import { HtmlMoneyView } from "./HtmlMoneyView";

export class HtmlInventoryView extends HtmlElement implements InventoryView {
  private _onItemsMove = new Subject<(Item | undefined | null)[]>();
  private content: HTMLDivElement;
  private cells: HtmlCellView[] = [];
  private balanceView: HtmlMoneyView;
  private items: (Item | undefined)[] = [];
  private itemIndexDragging: number | null = null;
  constructor(
    scene: Scene,
    playerInput: ClientPlayerInput,
    moneyView: HtmlMoneyView,
    private slotsCount: number = 20
  ) {
    super(
      scene,
      "Inventory",
      document.getElementById("gameContainer") as HTMLDivElement
    );
    this.balanceView = moneyView;
    this.container.style.top = `0`;
    this.container.style.bottom = `0`;
    this.container.style.right = `5%`;
    this.container.style.margin = `auto 0`;

    this.initBackground();
    this.initContent();
    this.initTitle();
    this.initCells();
    this.initMoney();
    this.container.hidden = true;
    playerInput.onInventoryChange.subscribe(() => {
      if (!playerInput.inventory) return;
      this.container.hidden = !this.container.hidden;
    });
    this.initDrag();
    this.setSize();

    this.scene.scale.addListener(Phaser.Scale.Events.RESIZE, () => {
      this.setSize();
    });
  }
  get onItemMove() {
    return this, this._onItemsMove.asObservable();
  }

  private setSize() {
    const aspectRatio = 250 / 360;
    const height = this.scene.game.scale.displaySize.height * 0.5;
    this.container.style.height = `${height}px`;
    this.container.style.width = `${height * aspectRatio}px`;
    const newCellSize = (height * 50) / 360;
    this.cells.forEach((cell) => {
      cell.setSize(newCellSize);
    });
  }

  saveItems(items: (Item | undefined)[]) {
    this.items = items;

    for (let i = 0; i < this.slotsCount; i++) {
      const cell = this.cells[i];
      cell.clear();
      const item = items[i];
      if (!item) continue;
      cell.setItem(item);
    }
  }

  initContent() {
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.content.style.width = "100%";
    this.content.style.height = "100%";
    this.content.style.top = "0";
    this.container.appendChild(this.content);
  }

  initBackground() {
    const background = document.createElement("img");

    background.src =
      "https://img.freepik.com/foto-gratis/textura-estuco-color-ocre_1360-504.jpg?w=2000";
    background.style.height = "100%";
    background.style.width = "100%";
    background.style.objectFit = "none";

    this.container.appendChild(background);
  }

  initTitle() {
    const title = document.createElement("p");
    title.style.color = "whitesmoke";
    title.style.position = "relative";
    title.innerText = "Inventory";
    title.style.textAlign = "center";
    title.style.width = "100%";
    title.style.margin = "0";
    title.style.fontSize = "25px";
    title.style.textShadow = "1px 1px 3px grey";
    this.content.appendChild(title);
  }

  initCells() {
    const cellContainer = document.createElement("div");
    cellContainer.style.display = "flex";
    cellContainer.style.flexFlow = "wrap";
    cellContainer.style.padding = "unset 25px unset 25px";
    cellContainer.style.justifyContent = "center";

    this.content.appendChild(cellContainer);

    for (let i = 0; i < this.slotsCount; i++) {
      const cell = new HtmlCellView(50, [
        ItemType.ARMOR_EQUIPMENT,
        ItemType.HELMET_EQUIPMENT,
        ItemType.GLOVES_EQUIPMENT,
        ItemType.BOOTS_EQUIPMENT,
        ItemType.PRIMARY_WEAPON,
        ItemType.SECONDARY_WEAPON,
        ItemType.CONSUMIBLE,
        ItemType.QUEST,
      ]);
      cellContainer.appendChild(cell.element);
      cell.onItemStartDrag.subscribe(() => {
        if (this.itemIndexDragging !== null) return;
        this.itemIndexDragging = i;
      });
      cell.onItemDropped.subscribe(() => {
        if (this.itemIndexDragging === null) return;
        if (this.itemIndexDragging === i) {
          this.itemIndexDragging = null;
          return;
        }
        if (this.items[i]) return;
        this.items[i] = this.items[this.itemIndexDragging];
        this.items[this.itemIndexDragging] = undefined;
        this.itemIndexDragging = null;
        this._onItemsMove.next(this.items);
      });
      this.cells.push(cell);
    }
  }

  initMoney() {
    this.balanceView.element.style.position = "absolute";
    this.balanceView.element.style.bottom = "0";
    this.balanceView.element.style.right = "0";
    this.content.appendChild(this.balanceView.element);
  }

  private initDrag() {
    interact(this.container).draggable({
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      autoScroll: false,

      listeners: {
        move: this.dragMoveListener,
      },
    });
  }

  private dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    target.style.transform = "translate(" + x + "px, " + y + "px)";

    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }
}
