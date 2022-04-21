import { AsyncRepository, SimpleRepository } from "../../domain/repository";

export class InMemoryRepository<T extends { id: string }>
  implements SimpleRepository<T>
{
  private store: Map<string, T> = new Map();
  get(id: string): T | undefined {
    return this.store.get(id);
  }
  save(obj: T) {
    this.store.set(obj.id, obj);
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
      this.save({ ...obj, ...payload });
    }
  }
}

export class InMemoryAsyncRepository<T extends { id: string }>
  implements AsyncRepository<T>
{
  private store: Map<string, T> = new Map();
  get(id: string): Promise<T | undefined> {
    return Promise.resolve(this.store.get(id));
  }
  save(obj: T): Promise<void> {
    this.store.set(obj.id, obj);
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
      obj ? this.save({ ...obj, ...payload }) : Promise.resolve()
    );
  }
}
