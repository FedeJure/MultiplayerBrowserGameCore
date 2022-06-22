import { Observable } from "rxjs";
import { GameBalance } from "../inventory/balance";
import { Item } from "../items/item";

export interface LootView {
    showWith(items: (Item | undefined)[], balance: GameBalance)
    onClaimLoot: Observable<(Item | undefined)[]>
}