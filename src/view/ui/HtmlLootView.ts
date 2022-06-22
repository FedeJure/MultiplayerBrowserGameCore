import { Observable, Subject } from "rxjs";
import { GameBalance } from "../../domain/inventory/balance";
import { Item } from "../../domain/items/item";
import { LootView } from "../../domain/loot/lootView";
import { HtmlCellView } from "./HtmlCellView";
import { HtmlMoneyView } from "./HtmlMoneyView";

export class HtmlLootView implements LootView {
  element: HTMLDivElement;
  private mainContainer: HTMLDivElement;
  private cells: HtmlCellView[] = [];
  private cellContainer: HTMLDivElement;
  private selectedIndexes: number[] = [];
  private _onClaimLoot = new Subject<(Item | undefined)[]>();
  private gameBalance: HtmlMoneyView

  private items: (Item | undefined)[] = [];
  constructor() {
    this.element = document.createElement("div");
    this.element.style.height = "100%";
    this.element.style.width = "100%";
    this.mainContainer = document.createElement("div");

    const auxContainer = document.createElement('div')
    auxContainer.style.height = "100%";
    auxContainer.style.width = "100%";
    auxContainer.style.display = 'flex'
    auxContainer.style.alignContent = 'center'
    auxContainer.style.justifyContent = 'center'
    auxContainer.appendChild(this.mainContainer);
    this.element.appendChild(auxContainer)

    this.mainContainer.style.height = "200px";
    this.mainContainer.style.width = "160px";
    this.mainContainer.style.display = "flex";
    this.mainContainer.style.flexFlow = "column";
    this.mainContainer.style.alignContent = "center";
    this.mainContainer.style.justifyContent = "center";
    this.mainContainer.style.backgroundImage = 'url("https://img.freepik.com/foto-gratis/textura-estuco-color-ocre_1360-504.jpg?w=2000")'

    const title = document.createElement("h4");
    title.innerText = "Loot";
    this.mainContainer.appendChild(title);

    this.cellContainer = document.createElement("div");
    this.cellContainer.style.height = "150px";
    this.cellContainer.style.width = "160px";
    this.cellContainer.style.display = "flex";
    this.cellContainer.style.overflowY = "auto";
    this.cellContainer.style.overflowX = "hidden";
    this.cellContainer.style.flexWrap = "wrap";
    this.cellContainer.style.justifyContent = "center";
    this.mainContainer.appendChild(this.cellContainer);

    this.gameBalance = new HtmlMoneyView()
    this.mainContainer.appendChild(this.gameBalance.element)

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.alignContent = "center";
    buttonContainer.style.justifyContent = "center";
    const button = document.createElement("button");
    button.innerText = 'Claim loot'
    buttonContainer.appendChild(button);
    this.mainContainer.appendChild(buttonContainer);

    button.addEventListener("click", () => {
      this._onClaimLoot.next(
        this.items.map((item, i) =>
          this.selectedIndexes.includes(i) ? item : undefined
        )
      );
      this.selectedIndexes = [];
      this.items = [];
      this.setVisible(false)
    });

    this.setVisible(false)
  }
  showWith(items: (Item | undefined)[], balance: GameBalance) {
    this.items = items;
    this.createCells(Math.max(6,items.length));
    this.initItems()
    this.setVisible(true)
    this.gameBalance.setBalance(balance)
    console.log("VISIBLEE")
  }

  private initItems() {
    this.items.forEach((item, i) => {
        const cell = this.cells[i]
        if (!cell || !item) return
        cell.setItem(item)
    })
  }

  private createCells(count: number) {
    this.cells.forEach((cell) => {
      cell.element.remove();
    });
    this.cells = [];
    for (let i = 0; i < count; i++) {
      const cell = new HtmlCellView(50, undefined, true);
      this.cells.push(cell);
      this.cellContainer.appendChild(cell.element)
      if (this.items[i]) {
        cell.element.addEventListener("click", () => {
          if (this.selectedIndexes.includes(i)) {
            this.selectedIndexes = this.selectedIndexes.filter((j) => j !== i);
            cell.setSelected(false);
            return;
          }
          this.selectedIndexes.push(i);
          cell.setSelected(true);
        });
      }
    }
    this.selectedIndexes = [];
  }
  get onClaimLoot(): Observable<(Item | undefined)[]> {
    return this._onClaimLoot;
  }

  private setVisible(visible: boolean) {
    this.mainContainer.style.display = visible ? 'flex' : 'none';
  }
}
