import { HtmlElement } from "./HtmlElement";

export class InventoryView extends HtmlElement {
  private content: HTMLDivElement;
  private cells: HTMLDivElement[]
  constructor(private slotsCount: number = 16) {
    super("Inventory");
    this.container.style.top = `0`;
    this.container.style.bottom = `0`;
    this.container.style.right = `5%`;
    this.container.style.margin = `auto 0`;
    this.container.style.width = '250px'
    this.container.style.height = '360px'
    this.initBackground();
    this.initContent();
    this.initTitle();
    this.initCells();
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
    title.style.position = "relative";
    title.innerText = "Inventory";
    title.style.textAlign = "center";
    title.style.width = "100%";
    title.style.marginTop = '0'
    this.content.appendChild(title);
  }

  initCells() {
      const cellContainer = document.createElement('div')
      cellContainer.style.display = 'flex'
      cellContainer.style.flexFlow = 'wrap'
      cellContainer.style.padding = "unset 25px unset 25px"
      cellContainer.style.justifyContent = 'center'

      this.content.appendChild(cellContainer)

      for (let i = 0; i < this.slotsCount; i++) {
          const cell = document.createElement('div')
          cell.style.width = '50px'
          cell.style.height = '50px'
          cell.style.backgroundColor = 'red'
          cell.style.margin = '1px'

          cellContainer.appendChild(cell)
          
      }
  }
}
