import mongoose from "mongoose";
import { PlayerStats } from "../../../domain/player/playerStats";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { EntityStatsType } from "./MongooseTypes";

export class MongoosePlayerStatsRepository extends MongooseAsyncRepository<PlayerStats> {
  constructor() {
    const schema = new mongoose.Schema<PlayerStats>({
      ...EntityStatsType,
      inventorySize: Number,
      maxJumps: Number,
      exp: Number
    });
    super("playerStats", schema);
  }
}
