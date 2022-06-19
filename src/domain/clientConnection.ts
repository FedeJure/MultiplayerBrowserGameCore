import { Observable } from "rxjs";
import { LocalPlayerInitialStateDto } from "../infrastructure/dtos/localPlayerInitialStateDto";
import { PlayerInitialStateDto } from "../infrastructure/dtos/playerInitialStateDto";
import { PlayerInventoryDto } from "./inventory/playerInventoryDto";
import {
  EnvironmentObjectDetailsRequest,
  EnvironmentObjectDetailsResponse,
  ItemDetailRequest,
  ItemDetailResponse,
  PlayerInputEvent,
} from "../infrastructure/events/gameEvents";
import { ProcessedMap } from "./environment/processedMap";
import { Loot } from "./loot/loot";

export interface ClientConnection {
  connectionId: string;
  connectionTime: Date;
  playerId?: string;
  onPlayerConnection(): Observable<{ playerId: string }>;
  sendInitialStateEvent(
    localPlayer: LocalPlayerInitialStateDto,
    players: PlayerInitialStateDto[],
    currentMap: ProcessedMap | undefined,
    neighborMaps: ProcessedMap[] | undefined
  ): void;
  join(roomName: string | string[]): Promise<{ previousRooms: string[] }>;
  onInput(): Observable<PlayerInputEvent>;
  sendMapUpdateEvent(
    newCurrentMap: ProcessedMap,
    neighborMaps: ProcessedMap[]
  ): void;
  sendInventoryEvent(inventory: PlayerInventoryDto);
  sendConnectedPlayer(player: PlayerInitialStateDto);
  onItemDetailRequest(): Observable<{
    ev: ItemDetailRequest;
    callback: (ev: ItemDetailResponse) => void;
  }>;
  onEnvironmentObjectRequest(): Observable<{
    ev: EnvironmentObjectDetailsRequest;
    callback: (ev: EnvironmentObjectDetailsResponse) => void;
  }>;
  setPlayerId(playerId: string);
  sendLootAppear(loots: Loot[]);
  sendLootDisappear(loots: Loot[]);
}
