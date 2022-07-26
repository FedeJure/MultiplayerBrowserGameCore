import { connection } from "mongoose";
import { ClientConnection } from "../clientConnection";
import { Enemy } from "../enemies/enemy";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";

export function sendEnemiesDataForRoom(
  rooms: string[],
  roomManager: RoomManager,
  enemiesRepository: SimpleRepository<Enemy>,
  connection: ClientConnection
) {
  const enemiesByRoom = roomManager.getEnemiesByRoom();
  rooms.forEach((room) => {
    const enemyIds = enemiesByRoom[room] ?? [];
    const enemies = enemyIds.map((id) => enemiesRepository.get(id));
    const enemiesData = enemies
      .filter((enemy) => enemy)
      .map((enemy) => ({
        state: enemy!.state,
        info: enemy!.info,
        stats: enemy!.stats,
      }));

    connection.sendEnemiesCreation({ enemies: enemiesData });
  });
}
