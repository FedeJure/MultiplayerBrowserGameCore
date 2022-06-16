import { Item } from "../items/item";
import { InventoryView } from "./inventoryView";
import { Money } from "./Money";

export class PlayerInventory {
  constructor(
    private _items: (Item | null)[],
    readonly money: Money,
    private view?: InventoryView,
  ) {}

  get items() {
    return this._items;
  }

  addItem(item: Item) {
    for (let i = 0; i < this.items.length; i++) {
      const foundedItem = this.items[i];
      if (foundedItem === null) {
        this.items[i] = item;
        return;
      }
    }
    throw new Error("Inventory full");
  }

  setItems(items: (Item | null)[]) {
    this._items = items;
    this.view?.saveItems(items)
  }
}
