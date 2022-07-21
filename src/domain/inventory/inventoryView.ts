import { Item } from "../items/item";

export interface InventoryView {
  saveItems(items: (Item | undefined | null)[]);
}
