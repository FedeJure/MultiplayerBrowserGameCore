import { Observable } from "rxjs";
import { PlayerInputDto } from "../infrastructure/dtos/playerInputDto";
import {
  InitialGameStateEvent,
  InventoryUpdatedEvent,
  ItemDetailResponse,
  MapUpdateEvent,
  NewPlayerConnectedEvent,
  PlayerDisconnectedEvent,
  PlayerStatesEvent,
} from "../infrastructure/events/gameEvents";
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
  emitGetItemDetails(ids: Item['id'][]): Observable<ItemDetailResponse>
}
