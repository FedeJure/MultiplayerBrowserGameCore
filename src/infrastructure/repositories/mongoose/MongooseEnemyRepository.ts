import mongoose, { Mongoose } from "mongoose";
import { EnemyState } from "../../../domain/enemies/EnemyState";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { EnemyStateType } from "./MongooseTypes";
export class MongooseEnemiesStatesRepository extends MongooseAsyncRepository<EnemyState> {
  constructor(instance?: Mongoose) {
    const schema = new mongoose.Schema<EnemyState>(EnemyStateType);
    super("enemiesState", schema, instance);
  }
}
