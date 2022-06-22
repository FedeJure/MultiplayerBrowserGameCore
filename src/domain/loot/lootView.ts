import { Observable } from "rxjs";
import { Item } from "../items/item";

export interface LootView {
    showWith(items: (Item | undefined)[])
    onClaimLoot: Observable<(Item | undefined)[]>
}