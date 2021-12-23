import { RoomConnection } from "./roomConnection"

type RoomId = number

export class RoomManager {
    private rooms: {[key: RoomId]: RoomConnection} = {}
    constructor() {
        
    }

    createRoomWithId(roomId: RoomId, room: RoomConnection) {
        this.rooms[roomId] = room
    }

    emitOnRoom(roomId: RoomId, event: string, data: any) {
        this.rooms[roomId]?.emit(event, data)
    }
}