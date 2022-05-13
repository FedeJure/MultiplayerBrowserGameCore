import { ClientConnection } from "../domain/clientConnection";
import { ProcessedMap } from "../domain/environment/processedMap";
import { RoomManager, RoomId, GetRoomId } from "../domain/roomManager";

export class SocketRoomManager implements RoomManager {
  private playersByRoom: { [key: RoomId]: string[] | undefined } = {};
  private enemiesByRoom: { [key: RoomId]: string[] | undefined } = {};
  constructor() {}

  async joinToRoom(
    playerId: string,
    conn: ClientConnection,
    maps: ProcessedMap[]
  ) {
    const roomIds = maps.map(GetRoomId);
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
    return roomIds;
  }

  getPlayersByRoom() {
    return this.playersByRoom;
  }

  joinEnemyToRoom(enemyId: string, newRooms: RoomId[], prevRooms: RoomId[]) {
    newRooms.forEach(this.initEnemyRoomIfNotExist.bind(this));
    prevRooms.forEach(this.initEnemyRoomIfNotExist.bind(this));
    prevRooms.forEach((room) => {
      this.enemiesByRoom[room] = this.enemiesByRoom[room]!.filter(
        (id) => id !== enemyId
      );
    });

    newRooms.forEach((room) => {
      this.enemiesByRoom[room]!.push(enemyId);
    });
  }

  private initEnemyRoomIfNotExist(id: RoomId) {
    if (!this.enemiesByRoom[id]) this.enemiesByRoom[id] = [];
  }
  getEnemiesByRoom(): { [key: RoomId]: string[] | undefined } {
    return this.enemiesByRoom;
  }
}
