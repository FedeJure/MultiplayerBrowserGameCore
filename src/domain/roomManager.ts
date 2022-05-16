import { ClientConnection } from "./clientConnection";
import { Enemy } from "./enemies/Enemy";
import { ProcessedMap } from "./environment/processedMap";
import { Player } from "./player/players/player";

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
    enemyId: Enemy["info"]["id"],
    newRooms: RoomId[],
    prevRoom: RoomId[]
  );
  removeEnemyFromRoom(enemyId: Enemy["info"]["id"], rooms: RoomId[]);
  getPlayersByRoom(): { [key: RoomId]: Player["info"]["id"][] | undefined };
  getEnemiesByRoom(): { [key: RoomId]: Enemy["info"]["id"][] | undefined };
}
