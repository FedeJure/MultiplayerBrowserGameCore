import mongoose from "mongoose";
import { PlayerInfo } from "../../../domain/player/playerInfo";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { PlayerInfoType } from "./MongooseTypes";

export class MongoosePlayerInfoRepository extends MongooseAsyncRepository<PlayerInfo> {
  constructor() {
    const schema = new mongoose.Schema<PlayerInfo>(PlayerInfoType);
    super("playerInfo", schema);
  }
}
