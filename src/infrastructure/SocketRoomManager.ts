import { ClientConnection } from "../domain/clientConnection";
import { ProcessedMap } from "../domain/environment/processedMap";
import { RoomManager, PlayerId, RoomId } from "../domain/roomManager";
import { PlayerStateRepository } from "./repositories/playerStateRepository";

export class SocketRoomManager implements RoomManager {
  private playersByRoom: { [key: RoomId]: PlayerId[] | undefined } = {};
  constructor(private readonly playerStateRepository: PlayerStateRepository) {}

  private getRoomId(map: ProcessedMap) {
    return map.id.toString();
  }

  async joinToRoom(
    playerId: string,
    conn: ClientConnection,
    maps: ProcessedMap[]
  ) {
    const roomIds = maps.map(this.getRoomId);
    const { previousRooms } = await conn.join(roomIds);
    console.log("prev roms", previousRooms);
    previousRooms.forEach((r) => {
      if (!this.playersByRoom[r]) return;
      this.playersByRoom[r] = [
        ...this.playersByRoom[r]!.filter((p) => p !== playerId),
      ];
      if (this.playersByRoom[r]!.length === 0) delete this.playersByRoom[r];
    });
    roomIds.forEach((r) => {
      if (!this.playersByRoom[r]) this.playersByRoom[r] = [];
      this.playersByRoom[r]?.push(playerId);
    });
    this.playerStateRepository.updateStateOf(playerId, {
      currentRooms: roomIds,
    });
    return roomIds;
  }

  getPlayersByRoom() {
    return this.playersByRoom;
  }
}
