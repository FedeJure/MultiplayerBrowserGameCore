import { Item } from "../items/item";
import { InventoryView } from "./inventoryView";
import { Balance } from "./balance";
import { MoneyView } from "./moneyView";
import { PlayerInventoryDto } from "./playerInventoryDto";

export class PlayerInventory {
  private _balance: Balance;
  private _items: (Item | null)[];
  constructor(
    capacity: number,
    private view?: InventoryView,
    moneyView?: MoneyView
  ) {
    this._items = new Array(capacity);
    this._balance = new Balance(moneyView);
  }

  get items() {
    return this._items;
  }

  get balance() {
    return this._balance;
  }

  get dto(): PlayerInventoryDto {
    return {
      items: this._items.map((i) => (i ? i.id : null)),
      balance: this.balance.amount,
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
