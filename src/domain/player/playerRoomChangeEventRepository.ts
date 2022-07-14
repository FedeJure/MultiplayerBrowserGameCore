import { RoomId } from "../roomManager";
import { PlayerInfo } from "./playerInfo";
import { PlayerRoomChangeEvent } from "./playerRoomChangeEvent";

export interface PlayerRoomChangeEventRepository {
    save(playerId: PlayerInfo['id'], newRooms: RoomId[], oldRooms: RoomId[]): Promise<void>
    popAll(): Promise<PlayerRoomChangeEvent[]>
}