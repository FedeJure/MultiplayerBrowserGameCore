import mongoose from "mongoose";
import { Item } from "../../../domain/items/item";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";

export class MongooseItemRepository extends MongooseAsyncRepository<Item> {
  constructor() {
    const schema = new mongoose.Schema<Item>({
      id: String,
      types: [String],
      icon: String,
      model: String,
      name: String,
      detail: String,
    });
    super("item", schema);
  }
}
