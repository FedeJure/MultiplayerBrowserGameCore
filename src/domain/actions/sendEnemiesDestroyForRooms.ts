import { ClientConnection } from "../clientConnection";
import { RoomManager } from "../roomManager";

export function sendEnemiesDestroyForRoom(
  rooms: string[],
  roomManager: RoomManager,
  connection: ClientConnection
) {
  const enemiesByRoom = roomManager.getEnemiesByRoom();
  rooms.forEach((room) => {
    const enemyIds = enemiesByRoom[room] ?? [];

    connection.sendEnemiesDestroy(enemyIds);
  });
}
