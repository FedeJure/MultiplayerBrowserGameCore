import mongoose from "mongoose";
import { PlayerBalance } from "../../../domain/inventory/playerBalance";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { EntityInfoType } from "./MongooseTypes";

export class MongoosePlayerBalanceRepository extends MongooseAsyncRepository<PlayerBalance> {
  constructor() {
    const schema = new mongoose.Schema<PlayerBalance>({
      playerId: EntityInfoType.id,
      amount: Number
    });
    super("playerBalance", schema);
  }
}
