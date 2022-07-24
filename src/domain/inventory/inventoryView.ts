import { Observable } from "rxjs";
import { Item } from "../items/item";

export interface InventoryView {
  saveItems(items: (Item | undefined | null)[]);
  onItemMove: Observable<(Item | undefined | null)[]>
}
