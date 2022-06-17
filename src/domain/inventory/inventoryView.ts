import { Item } from "../items/item";
import { Money } from "./Money";

export interface InventoryView {
  saveItems(items: (Item | null)[]);
  setMoney(money: Money)
}
