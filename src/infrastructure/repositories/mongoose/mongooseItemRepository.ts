import mongoose from "mongoose";
import { Item } from "../../../domain/items/item";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { ItemType } from "./MongooseTypes";

export class MongooseItemRepository extends MongooseAsyncRepository<Item> {
  constructor() {
    const schema = new mongoose.Schema<Item>(ItemType);
    super("item", schema);
  }
}
