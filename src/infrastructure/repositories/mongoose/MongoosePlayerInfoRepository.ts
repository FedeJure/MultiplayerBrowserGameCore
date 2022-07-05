import mongoose from "mongoose";
import { PlayerInfo } from "../../../domain/player/playerInfo";
import { MongooseAsyncRepository } from "../mongooseAsyncRepository";
import { EntityInfoType } from "./MongooseTypes";

export class MongoosePlayerInfoRepository extends MongooseAsyncRepository<PlayerInfo> {
  constructor() {
    const schema = new mongoose.Schema<PlayerInfo>(EntityInfoType);
    super("playerInfo", schema);
  }
}
