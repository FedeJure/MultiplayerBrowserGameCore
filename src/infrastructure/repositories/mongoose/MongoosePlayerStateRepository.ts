import mongoose, { Mongoose } from "mongoose";
import { PlayerState } from "../../../domain/player/playerState";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { PlayerStateType } from "./MongooseTypes";

export class MongoosePlayerStateRepository extends MongooseAsyncRepository<PlayerState> {
  constructor(instance?: Mongoose) {
    const schema = new mongoose.Schema<PlayerState>(PlayerStateType);
    super("playertate", schema, instance);
  }
}
