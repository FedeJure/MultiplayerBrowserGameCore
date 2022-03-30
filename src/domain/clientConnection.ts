import { Observable } from "rxjs";
import { PlayerInitialStateDto } from "../infrastructure/dtos/playerInitialStateDto";
import { PlayerInputEvent } from "../infrastructure/events/gameEvents";
import { ProcessedMap } from "./environment/processedMap";
import { PlayerInventory } from "./items/playerInventory";

export interface ClientConnection {
  connectionId: string;
  connectionTime: Date;
  onPlayerConnection(): Observable<{ playerId: string }>;
  sendInitialStateEvent(
    players: PlayerInitialStateDto[],
    currentMap: ProcessedMap | undefined,
    neighborMaps: ProcessedMap[] | undefined
  ): void;
  join(roomName: string | string[]): Promise<{ previousRooms: string[] }> ;
  onInput(): Observable<PlayerInputEvent>;
  sendMapUpdateEvent(
    newCurrentMap: ProcessedMap,
    neighborMaps: ProcessedMap[]
  ): void;
  sendInventoryEvent(inventory: PlayerInventory)
  sendConnectedPlayer(player: PlayerInitialStateDto)
}
