import { Observable } from "rxjs";
import { PlayerInitialStateDto } from "../infrastructure/dtos/playerInitialStateDto";
import { PlayerInventoryDto } from "../infrastructure/dtos/playerInventoryDto";
import { EnvironmentObjectDetailsRequest, EnvironmentObjectDetailsResponse, ItemDetailRequest, ItemDetailResponse, PlayerInputEvent } from "../infrastructure/events/gameEvents";
import { ProcessedMap } from "./environment/processedMap";

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
  sendInventoryEvent(inventory: PlayerInventoryDto)
  sendConnectedPlayer(player: PlayerInitialStateDto)
  onItemDetailRequest(): Observable<{
    ev: ItemDetailRequest;
    callback: (ev: ItemDetailResponse) => void;
  }>
  onEnvironmentObjectRequest(): Observable<{
    ev: EnvironmentObjectDetailsRequest;
    callback: (ev: EnvironmentObjectDetailsResponse) => void;
  }>
}
