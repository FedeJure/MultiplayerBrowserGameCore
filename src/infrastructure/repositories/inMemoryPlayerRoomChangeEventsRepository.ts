import { PlayerRoomChangeEvent } from "../../domain/player/playerRoomChangeEvent";
import { PlayerRoomChangeEventRepository } from "../../domain/player/playerRoomChangeEventRepository";

export class InMemoryPlayerRoomChangeEventsRepository implements PlayerRoomChangeEventRepository {
    save(playerId: string, newRooms: string[], oldRooms: string[]): Promise<void> {
        return Promise.resolve()
    }
    popAll(): Promise<PlayerRoomChangeEvent[]> {
        return Promise.resolve([])
    }

}