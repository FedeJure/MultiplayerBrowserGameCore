import { Observable } from "rxjs";

export interface LootView {
    onDestroy: Observable<void>
    destroy()
}