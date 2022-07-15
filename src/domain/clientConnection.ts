import { Observable } from "rxjs";
import { LocalPlayerInitialStateDto } from "../infrastructure/dtos/localPlayerInitialStateDto";
import { PlayerInitialStateDto } from "../infrastructure/dtos/playerInitialStateDto";
import { PlayerInventoryDto } from "./inventory/playerInventoryDto";
import {
  ClaimLootEvent,
  EnvironmentObjectDetailsRequest,
  EnvironmentObjectDetailsResponse,
  ItemDetailRequest,
  ItemDetailResponse,
  PlayerConnectionResponseEvent,
  PlayerInputEvent,
} from "../infrastructure/events/gameEvents";
import { ProcessedMap } from "./environment/processedMap";
import { Loot } from "./loot/loot";
import { BalanceDto } from "./inventory/balanceDto";
import { MovementPlayerStateDto } from "./player/movement/movementPlayerStateDto";

export interface ClientConnection {
  connectionId: string;
  connectionTime: Date;
  playerId?: string;
  onPlayerConnection(): Observable<{
    playerId: string;
    callback: (ev: PlayerConnectionResponseEvent) => void;
  }>;
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
  sendInventoryBalanceEvent(
    inventory?: PlayerInventoryDto,
    balance?: BalanceDto
  );
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
  onClaimLoot(): Observable<ClaimLootEvent>;
  sendPositionChange(dto: MovementPlayerStateDto);
}
