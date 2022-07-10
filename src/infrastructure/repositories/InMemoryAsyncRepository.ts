import { Subject } from "rxjs";
import { AsyncRepository } from "../../domain/repository";
import { v4 as uuidv4 } from "uuid";

export class InMemoryAsyncRepository<T> implements AsyncRepository<T> {
  getBy(query: Partial<T>): Promise<T | null | undefined> {
    return this.getAll(query).then(results => results[0])
  }
  getId() {
    return uuidv4();
  }
  private store: Map<string, T> = new Map();
  private _onSave = new Subject<T>();
  private _onRemove = new Subject<T>();
  get(id: string): Promise<T | undefined> {
    return Promise.resolve(this.store.get(id));
  }
  save(id: string, obj: T): Promise<void> {
    this.store.set(id, obj);
    this._onSave.next(obj);
    return Promise.resolve();
  }
  getAll(filter?: Partial<T>): Promise<T[]> {
    const values = Array.from(this.store.values());
    if (!filter) return Promise.resolve(values);
    const filters = Object.keys(filter);
    return Promise.resolve(
      values.filter((obj) => filters.every((k) => obj[k] === filter[k]))
    );
  }
  update(id: string, payload: Partial<T>): Promise<void> {
    return this.get(id).then((obj) =>
      obj ? this.save(id, { ...obj, ...payload }) : Promise.resolve()
    );
  }

  async remove(id: string) {
    const obj = await this.get(id);
    if (obj) this._onRemove.next(obj);
    this.store.delete(id);
    return Promise.resolve();
  }

  get onSave() {
    return this._onSave;
  }
  get onRemove() {
    return this._onRemove;
  }
}
