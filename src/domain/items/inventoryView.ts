import { Item } from "./item";

export interface InventoryView {
  saveItems(items: Item[]);
}
