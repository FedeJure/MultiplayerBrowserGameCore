import mongoose from "mongoose";
import { PlayerState } from "../../../domain/player/playerState";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { PlayerStateType } from "./MongooseTypes";

export class MongoosePlayerStateRepository extends MongooseAsyncRepository<PlayerState> {
  constructor() {
    const schema = new mongoose.Schema<PlayerState>(PlayerStateType);
    super("playerState", schema);
  }
}
