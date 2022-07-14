import { Observable, Subject } from "rxjs";
import mongoose, { Mongoose } from "mongoose";
import { AsyncRepository } from "../../domain/repository";

export class MongooseAsyncRepository<T> implements AsyncRepository<T> {
  protected model: mongoose.Model<T>;
  private _onSave = new Subject<T>();
  private _onRemove = new Subject<T>();
  constructor(modelName: string, schema: mongoose.Schema, instance?: Mongoose) {
    const instanceToUse = instance ?? mongoose
    this.model = instanceToUse.model<T>(modelName, schema);
  }
  async getBy(query: Partial<T>): Promise<T | null | undefined> {
    const element = (await this.model.findOne(query).lean()) as
      | T
      | null
      | undefined;
    return element;
  }

  async get(_id: string) {
    const element = (await this.model.findById(_id).lean()) as
      | T
      | null
      | undefined;
    return element;
  }

  async save(_id: string, obj: T): Promise<void> {
    const created = new this.model({ ...obj, _id });
    await created.save();
    this._onSave.next(created);
  }
  async getAll(filter: Partial<T> | undefined = {}) {
    const elements = (await this.model
      .find(filter)
      .lean()) as T[];
    return elements;
  }
  async update(_id: string, payload: Partial<T>): Promise<void> {
    await this.model.findByIdAndUpdate(
      _id,
      { $set: payload },
      { runValidators: true, new: true, overwrite: true }
    );
  }
  async remove(_id: string): Promise<void> {
    const deleted = await this.model.findOneAndDelete({ _id });
    if (!deleted) return;
    this._onRemove.next(deleted);
  }
  get onSave(): Observable<T> {
    return this._onSave;
  }
  get onRemove(): Observable<T> {
    return this._onRemove;
  }

  getId() {
    return new mongoose.Types.ObjectId().toString();
  }
}
