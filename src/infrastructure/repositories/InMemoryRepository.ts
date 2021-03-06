import { Subject } from "rxjs";
import { SimpleRepository } from "../../domain/repository";

export class InMemoryRepository<T> implements SimpleRepository<T> {
  private store: Map<string, T> = new Map();
  private _onSave = new Subject<T>();
  private _onRemove = new Subject<T>();
  get(id: string): T | undefined {
    return this.store.get(id);
  }
  save(id: string, obj: T) {
    this.store.set(id, obj);
    this._onSave.next(obj);
  }
  getAll(filter?: Partial<T>): T[] {
    const values = Array.from(this.store.values());
    if (!filter) return values;
    const filters = Object.keys(filter);
    return values.filter((obj) => filters.every((k) => obj[k] === filter[k]));
  }
  update(id: string, payload: Partial<T>) {
    const obj = this.get(id);
    if (obj) {
      this.save(id, { ...obj, ...payload });
    }
  }
  remove(id: string) {
    const value = this.get(id);
    if (value) {
      this.store.delete(id);
      this._onRemove.next(value);
    }
  }
  get onSave() {
    return this._onSave;
  }
  get onRemove() {
    return this._onRemove;
  }
}


