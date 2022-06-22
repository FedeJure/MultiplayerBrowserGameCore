import { Observable, Subject } from "rxjs";

export class Inventory<T> {
  protected _items: (T | undefined)[];
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
      if (foundedItem === undefined) {
        this._items[i] = item;
        this._onChange.next();
        return;
      }
    }
    throw new Error("Inventory full");
  }

  setItems(items: (T | undefined)[]) {
    if (items.length > this._items.length) throw new Error("Inventory full");
    this._items = [...items, ...new Array(this._items.length - items.length)];
    this._onChange.next();
  }

  get onChange(): Observable<void> {
    return this._onChange;
  }
}
