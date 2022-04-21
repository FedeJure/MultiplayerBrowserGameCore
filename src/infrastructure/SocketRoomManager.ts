import { ClientConnection } from "../domain/clientConnection";
import { ProcessedMap } from "../domain/environment/processedMap";
import { InGamePlayersRepository } from "../domain/player/inGamePlayersRepository";
import { RoomManager, PlayerId, RoomId } from "../domain/roomManager";

export class SocketRoomManager implements RoomManager {
  private playersByRoom: { [key: RoomId]: PlayerId[] | undefined } = {};
  constructor(
    private readonly inGamePlayersRepository: InGamePlayersRepository
  ) {}

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
    this.inGamePlayersRepository.get(playerId)?.updateState({
      currentRooms: roomIds,
    });
    return roomIds;
  }

  getPlayersByRoom() {
    return this.playersByRoom;
  }
}
