import { RoomId } from "../roomManager";
import { PlayerInfo } from "./playerInfo";

export interface PlayerRoomChangeEvent {
    playerId: PlayerInfo['id']
    oldRooms: RoomId[]
    newRooms: RoomId[]
}