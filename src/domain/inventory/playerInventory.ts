import { Item } from "../items/item";
import { InventoryView } from "./inventoryView";

export class PlayerInventory {
  private _items: (Item | null)[];
  constructor(
    capacity: number,
    private view?: InventoryView
  ) {
    this._items = new Array(capacity);
  }

  get items() {
    return this._items;
  }


  get dto() {
    return {
      items: this._items.map((i) => (i ? i.id : null)),
    };
  }

  addItem(item: Item) {
    for (let i = 0; i < this.items.length; i++) {
      const foundedItem = this.items[i];
      if (foundedItem === null) {
        this._items[i] = item;
        return;
      }
    }
    throw new Error("Inventory full");
  }

  setItems(items: (Item | null)[]) {
    if (items.length > this._items.length) throw new Error("Inventory full");
    this._items = items;
    this.view?.saveItems(items);
  }
}
