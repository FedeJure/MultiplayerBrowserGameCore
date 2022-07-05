import mongoose from "mongoose";
import { EnemyModel } from "../../../domain/enemies/enemyModel/enemyModel";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { EnemyStatsType, EntityInfoType } from "./MongooseTypes";
export class MongooseEnemiesModelRepository extends MongooseAsyncRepository<EnemyModel> {
  constructor() {
    const schema = new mongoose.Schema<EnemyModel>({
      id: EntityInfoType.id,
      stats: EnemyStatsType,
      name: EntityInfoType.name,
      lootConfigId: String
    });
    super("enemiesModel", schema);
  }
}
