import { Observable } from "rxjs";
import { PlayerInputDto } from "../infrastructure/dtos/playerInputDto";
import {
  EnemiesStatesEvent,
  EnvironmentObjectDetailsResponse,
  InitialGameStateEvent,
  InventoryUpdatedEvent,
  ItemDetailResponse,
  LootsAppearEvent,
  LootsDisappearEvent,
  MapUpdateEvent,
  NewPlayerConnectedEvent,
  PlayerDisconnectedEvent,
  PlayerStatesEvent,
} from "../infrastructure/events/gameEvents";
import { EnvironmentObject } from "./environmentObjects/environmentObject";
import { Item } from "./items/item";

export interface ServerConnection {
  onNewPlayerConnected: Observable<NewPlayerConnectedEvent>;
  onPlayersStates: Observable<PlayerStatesEvent>;
  onInitialGameState: Observable<InitialGameStateEvent>;
  onPlayerDisconnected: Observable<PlayerDisconnectedEvent>;
  onPing: Observable<number>;
  emitStartNewConnection(playerId: string): void;
  emitInput(playerId: string, input: PlayerInputDto, inputRequest: number): void;
  onMapUpdated: Observable<MapUpdateEvent>
  onInventoryUpdate: Observable<InventoryUpdatedEvent>
  onEnemyState: Observable<EnemiesStatesEvent>
  emitGetItemDetails(ids: Item['id'][]): Promise<ItemDetailResponse>
  emitGetEnvironmentObjectsDetails(ids: EnvironmentObject['id'][]): Promise<EnvironmentObjectDetailsResponse>
  onLootsAppear: Observable<LootsAppearEvent>
  onLootsDisappear: Observable<LootsDisappearEvent>
}
