import { Observable, Subject } from "rxjs";

export class Inventory<T> {
  protected _items: (T | undefined | null)[];
  protected _onChange = new Subject<void>();
  constructor(capacity: number) {
    this._items = new Array(capacity);
  }

  get items() {
    return this._items;
  }

  addItem(item: T) {
    for (let i = 0; i < this.items.length; i++) {
      const foundedItem = this.items[i];
      if (!foundedItem) {
        this._items[i] = item;
        this._onChange.next();
        return;
      }
    }
    throw new Error("Inventory full");
  }

  setItems(items: (T | undefined | null)[]) {
    if (items.length > this._items.length && !this._items.includes(null)) throw new Error("Inventory full");
    this._items = [...items, ...new Array(this._items.length - items.length)];
    this._onChange.next();
  }

  get onChange(): Observable<void> {
    return this._onChange;
  }
}
