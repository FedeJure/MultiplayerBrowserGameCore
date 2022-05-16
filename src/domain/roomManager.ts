import { ClientConnection } from "./clientConnection";
import { EnemyInfo } from "./enemies/EnemyInfo";
import { ProcessedMap } from "./environment/processedMap";
import {  PlayerInfo } from "./player/playerInfo";

export type RoomId = string;

export const GetRoomId = (map: ProcessedMap) => {
  return map.id.toString();
};

export interface RoomManager {
  joinToRoom(
    playerId: string,
    conn: ClientConnection,
    maps: ProcessedMap[]
  ): Promise<string[]>;
  joinEnemyToRoom(
    enemyId: EnemyInfo["id"],
    newRooms: RoomId[],
    prevRoom: RoomId[]
  );
  removeEnemyFromRoom(enemyId: EnemyInfo["id"], rooms: RoomId[]);
  getPlayersByRoom(): { [key: RoomId]: PlayerInfo["id"][] | undefined };
  getEnemiesByRoom(): { [key: RoomId]: EnemyInfo["id"][] | undefined };
}
