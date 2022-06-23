import interact from "interactjs";
import { Scene } from "phaser";
import { InventoryView } from "../../domain/inventory/inventoryView";
import { Item } from "../../domain/items/item";
import { ItemType } from "../../domain/items/itemType";
import { ClientPlayerInput } from "../../domain/player/playerInput";
import { HtmlCellView } from "./HtmlCellView";
import { HtmlElement } from "./HtmlElement";
import { HtmlMoneyView } from "./HtmlMoneyView";

export class HtmlInventoryView extends HtmlElement implements InventoryView {
  private content: HTMLDivElement;
  private cells: HtmlCellView[] = [];
  private balanceView: HtmlMoneyView
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
    this.balanceView = moneyView
    this.container.style.top = `0`;
    this.container.style.bottom = `0`;
    this.container.style.right = `5%`;
    this.container.style.margin = `auto 0`;
    this.container.style.width = "250px";
    this.container.style.height = "360px";
    this.initBackground();
    this.initContent();
    this.initTitle();
    this.initCells();
    this.initMoney();
    this.container.hidden = true;
    playerInput.onInventoryChange.subscribe(() => {
      this.container.hidden = !this.container.hidden;
    });
    this.initDrag()
  }
  saveItems(items: (Item | undefined)[]) {
    for (let i = 0; i < this.slotsCount; i++) {
      const cell = this.cells[i];
      cell.clear()
      const item = items[i]
      if (!item) return 
      cell.setItem(item) 
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
      "https://t4.ftcdn.net/jpg/02/65/26/93/360_F_265269365_KeYTSwRToCIegESwDdQluBxEFRqzuQF4.jpg";

    this.container.appendChild(background);
  }

  initTitle() {
    const title = document.createElement("p");
    title.style.color = 'whitesmoke'
    title.style.position = "relative";
    title.innerText = "Inventory";
    title.style.textAlign = "center";
    title.style.width = "100%";
    title.style.marginTop = "0";
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
      this.cells.push(cell);
    }
  }

  initMoney() {
    this.balanceView.element.style.position = 'absolute'
    this.balanceView.element.style.bottom = '0'
    this.balanceView.element.style.right = '0'
    this.content.appendChild(this.balanceView.element)
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

  private dragMoveListener (event) {
    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }
}
