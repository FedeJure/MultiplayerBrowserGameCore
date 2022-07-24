import { Item } from "../items/item";
import { Inventory } from "./inventory";
import { InventoryView } from "./inventoryView";

export class ClientInventory extends Inventory<Item> {
  constructor(capacity: number, private view: InventoryView) {
    super(capacity);
  }
  get dto() {
    return {
      items: this._items.map((i) => (i ? i.id : undefined)),
    };
  }

  setItems(items: (Item | undefined)[]): void {
    super.setItems(items);
    this.view.saveItems(this.items);
  }

  get onItemsSortChange() {
    return this.view.onItemMove;
  }
}
