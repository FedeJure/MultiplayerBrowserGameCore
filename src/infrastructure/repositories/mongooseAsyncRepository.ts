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

  async get(id: string) {
    return this.model
      .find({ id })
      .exec()
      .then((values) => values[0]);
  }
  async save(id: string, obj: T): Promise<void> {
    if ((obj as any).mapId) console.log(obj)
    const created = new this.model({...obj, id});
    await created.save();
    this._onSave.next(created);
  }
  async getAll(filter?: Partial<T> | undefined) {
    return await this.model.find(filter || {}, null, {new: true});
  }
  async update(id: string, payload: Partial<T>): Promise<void> {
    this.model.findOneAndUpdate({ id }, { $set: payload }, { runValidators: true });
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
