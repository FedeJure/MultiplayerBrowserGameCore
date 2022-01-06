import { ClientConnection } from "./clientConnection";
import { ProcessedMap } from "./environment/processedMap";

export type RoomId = string;
export type PlayerId = string;

export interface RoomManager {
    joinToRoom(playerId: string, conn: ClientConnection, maps: ProcessedMap[]): Promise<string[]>
    getPlayersByRoom(): { [key: RoomId]: PlayerId[] | undefined }
}