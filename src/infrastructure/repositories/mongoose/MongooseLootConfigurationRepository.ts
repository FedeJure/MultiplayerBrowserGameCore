import mongoose from "mongoose";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { LootConfiguration } from "../../../domain/loot/lootConfiguration";
import { ItemType } from "./MongooseTypes";

export class MongooseLootConfigurationRepository extends MongooseAsyncRepository<LootConfiguration> {
  constructor() {
    const schema = new mongoose.Schema<LootConfiguration>({
      id: String,
      items: [{ itemId: ItemType.id, probability: Number }],
      minItems: Number,
      maxItems: Number,
      minMoney: Number,
      maxMoney: Number,
    });
    super("lootConfiguration", schema);
  }
}
