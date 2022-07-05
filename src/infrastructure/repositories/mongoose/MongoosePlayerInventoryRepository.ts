import mongoose from "mongoose";
import { PlayerInventoryDto } from "../../../domain/inventory/playerInventoryDto";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { ItemType } from "./MongooseTypes";

export class MongoosePlayerInventoryRepository extends MongooseAsyncRepository<PlayerInventoryDto> {
  constructor() {
    const schema = new mongoose.Schema<PlayerInventoryDto>({
      items: [ItemType.id || undefined]
    });
    super("playerInventory", schema);
  }
}
