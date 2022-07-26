import { Observable } from "rxjs";
import { PlayerInputDto } from "../infrastructure/dtos/playerInputDto";
import {
  EnemiesStatesEvent,
  EnemyCreatedEvent,
  EnemyDestroyEvent,
  EnvironmentObjectDetailsResponse,
  InitialGameStateEvent,
  InventoryBalanceUpdatedEvent,
  ItemDetailResponse,
  LootsAppearEvent,
  LootsDisappearEvent,
  MapUpdateEvent,
  NewPlayerConnectedEvent,
  PlayerConnectionResponseEvent,
  PlayerDisconnectedEvent,
  PlayerStatesEvent,
} from "../infrastructure/events/gameEvents";
import { EnvironmentObject } from "./environmentObjects/environmentObject";
import { PlayerInventoryDto } from "./inventory/playerInventoryDto";
import { Item } from "./items/item";
import { Loot } from "./loot/loot";
import { MovementPlayerStateDto } from "./player/movement/movementPlayerStateDto";

export interface ServerConnection {
  onNewPlayerConnected: Observable<NewPlayerConnectedEvent>;
  onPlayersStates: Observable<PlayerStatesEvent>;
  onInitialGameState: Observable<InitialGameStateEvent>;
  onPlayerDisconnected: Observable<PlayerDisconnectedEvent>;
  onPing: Observable<number>;
  emitStartNewConnection(
    playerId: string
  ): Promise<PlayerConnectionResponseEvent>;
  emitInput(
    playerId: string,
    input: PlayerInputDto,
    inputRequest: number
  ): void;

  onMapUpdated: Observable<MapUpdateEvent>;
  onInventoryUpdate: Observable<InventoryBalanceUpdatedEvent>;
  onEnemyCreation: Observable<EnemyCreatedEvent>;
  onEnemyDestroy: Observable<EnemyDestroyEvent>;
  onEnemiesStates: Observable<EnemiesStatesEvent>;
  emitGetItemDetails(ids: Item["id"][]): Promise<ItemDetailResponse>;
  emitGetEnvironmentObjectsDetails(
    ids: EnvironmentObject["id"][]
  ): Promise<EnvironmentObjectDetailsResponse>;
  emitClaimLoot(lootId: Loot["id"], lootIndexes: number[], balance: number);
  emitInventoryOrderUpdated(dto: PlayerInventoryDto)
  onLootsAppear: Observable<LootsAppearEvent>;
  onLootsDisappear: Observable<LootsDisappearEvent>;
  onPositionChange: Observable<MovementPlayerStateDto>;
}
