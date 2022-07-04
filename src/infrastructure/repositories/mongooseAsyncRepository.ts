import { Observable, Subject } from "rxjs";
import mongoose from "mongoose";
import { AsyncRepository } from "../../domain/repository";

export class MongooseAsyncRepository<T> implements AsyncRepository<T> {
  private model: mongoose.Model<T>;
  private _onSave = new Subject<T>();
  private _onRemove = new Subject<T>();
  constructor(modelName: string, schema: mongoose.Schema) {
    this.model = mongoose.model<T>(modelName, schema);
  }
  get(id: string) {
    return this.model.findOne({ id }).exec();
  }
  async save(id: string, obj: T): Promise<void> {
    const created = await new this.model(obj);
    await created.save()
    this._onSave.next(created);
  }
  getAll(filter?: Partial<T> | undefined) {
    return this.model.find(filter || {}).exec();
  }
  async update(id: string, payload: Partial<T>): Promise<void> {
    this.model.updateOne({ id }, payload);
  }
  async remove(id: string): Promise<void> {
    const deleted = await this.model.findOneAndDelete({ id });
    if (!deleted) return;
    this._onRemove.next(deleted);
  }
  get onSave(): Observable<T> {
    return this._onSave;
  }
  get onRemove(): Observable<T> {
    return this._onRemove;
  }
}
