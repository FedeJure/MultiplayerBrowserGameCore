import mongoose, { Mongoose } from "mongoose";
import { PlayerRoomChangeEvent } from "../../../domain/player/playerRoomChangeEvent";
import { PlayerRoomChangeEventRepository } from "../../../domain/player/playerRoomChangeEventRepository";
import { PlayerRoomChangeEventType } from "./MongooseTypes";

export class MongoosePlayerRoomChangeRepository
  implements PlayerRoomChangeEventRepository
{
  protected model: mongoose.Model<PlayerRoomChangeEvent>;
  constructor(instance?: Mongoose) {
    const instanceToUse = instance ?? mongoose;
    const schema = new mongoose.Schema<PlayerRoomChangeEvent>(PlayerRoomChangeEventType)
    this.model = instanceToUse.model<PlayerRoomChangeEvent>(
      "playerRoomChange",
      schema
    );

  }
  async save(
    playerId: string,
    newRooms: string[],
    oldRooms: string[]
  ): Promise<void> {
    const created = new this.model({ playerId, newRooms, oldRooms });
    await created.save();
  }
  async popAll(): Promise<PlayerRoomChangeEvent[]> {
    const founded = await this.model.find({})
    await this.model.deleteMany({})
    return founded
  }

  subscribeToChange(callback) {
    this.model.watch().addListener('change', callback)
  }
}
