import { Observable, Subject } from "rxjs";
import { Socket } from "socket.io-client";

import { ServerConnection } from "../domain/serverConnection";
import { PlayerInputDto } from "./dtos/playerInputDto";
import {
  EnemiesStatesEvent,
  EnvironmentObjectDetailsResponse,
  GameEvents,
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
} from "./events/gameEvents";
import { SocketIOEvents } from "./events/socketIoEvents";

export class SocketServerConnection implements ServerConnection {
  readonly socket: Socket;

  private readonly _onInitialGameState = new Subject<InitialGameStateEvent>();
  private readonly _onNewPlayerConnected =
    new Subject<NewPlayerConnectedEvent>();
  private readonly _onPlayersStates = new Subject<PlayerStatesEvent>();
  private readonly _onPlayerDisconnected =
    new Subject<PlayerDisconnectedEvent>();
  private readonly _onPing = new Subject<number>();
  private readonly _onMapUpdated = new Subject<MapUpdateEvent>();
  private readonly _onInventoryUpdated =
    new Subject<InventoryBalanceUpdatedEvent>();
  private readonly _onEnemyStates = new Subject<EnemiesStatesEvent>();
  private readonly _onLootsApprear = new Subject<LootsAppearEvent>();
  private readonly _onLootsDisapprear = new Subject<LootsDisappearEvent>();

  constructor(masterSocket: Socket, gameStateSocket: Socket) {
    this.socket = masterSocket;

    masterSocket.on(GameEvents.INITIAL_GAME_STATE.name, (data) =>
      this._onInitialGameState.next(data)
    );
    masterSocket.on(GameEvents.NEW_PLAYER_CONNECTED.name, (data) =>
      this._onNewPlayerConnected.next(data)
    );
    gameStateSocket.on(GameEvents.PLAYERS_STATES.name, (data) =>
      this._onPlayersStates.next(data)
    );
    masterSocket.on(GameEvents.PLAYER_DISCONNECTED.name, (data) =>
      this._onPlayerDisconnected.next(data)
    );
    masterSocket.on(GameEvents.MAP_UPDATE.name, (data) =>
      this._onMapUpdated.next(data)
    );
    masterSocket.on(GameEvents.INVENTORY_UPDATED.name, (data) =>
      this._onInventoryUpdated.next(data)
    );
    masterSocket.on(GameEvents.ENEMIES_STATES.name, (data) =>
      this._onEnemyStates.next(data)
    );
    masterSocket.on(GameEvents.LOOT_APPEAR.name, (data) =>
      this._onLootsApprear.next(data)
    );
    masterSocket.on(GameEvents.LOOT_DISAPPEAR.name, (data) =>
      this._onLootsDisapprear.next(data)
    );

    var startTime = Date.now();
    masterSocket.on(SocketIOEvents.PONG, () =>
      this._onPing.next(Date.now() - startTime)
    );
    setInterval(() => {
      startTime = Date.now();
      masterSocket.emit(SocketIOEvents.PING);
    }, 2000);
  }
  emitClaimLoot(lootId: string, lootIndexes: number[], balance: number) {
    this.socket.emit(
      GameEvents.CLAIM_LOOT.name,
      GameEvents.CLAIM_LOOT.getEvent(lootId, lootIndexes, balance)
    );
  }

  emitGetEnvironmentObjectsDetails(
    ids: number[]
  ): Promise<EnvironmentObjectDetailsResponse> {
    return new Promise((res) => {
      this.socket.emit(
        GameEvents.ENVIRONMENT_OBJECT_DETAILS_REQUEST.name,
        GameEvents.ENVIRONMENT_OBJECT_DETAILS_REQUEST.getEvent(ids),
        (response: EnvironmentObjectDetailsResponse) => {
          res(response);
        }
      );
    });
  }

  get onInventoryUpdate() {
    return this._onInventoryUpdated;
  }

  get onMapUpdated() {
    return this._onMapUpdated;
  }

  get onInitialGameState() {
    return this._onInitialGameState;
  }

  get onNewPlayerConnected() {
    return this._onNewPlayerConnected;
  }

  get onPlayersStates() {
    return this._onPlayersStates;
  }

  get onPlayerDisconnected() {
    return this._onPlayerDisconnected;
  }

  get onPing() {
    return this._onPing;
  }

  get onEnemyState() {
    return this._onEnemyStates;
  }

  get onLootsAppear(): Observable<LootsAppearEvent> {
    return this._onLootsApprear;
  }
  get onLootsDisappear(): Observable<LootsDisappearEvent> {
    return this._onLootsDisapprear;
  }

  emitStartNewConnection(
    playerId: string
  ): Promise<PlayerConnectionResponseEvent> {
    return new Promise((res) => {
      this.socket.emit(
        GameEvents.PLAYER_CONNECTED.name,
        GameEvents.PLAYER_CONNECTED.getEvent(playerId),
        (response) => {
          res(response);
        }
      );
    });
  }

  emitInput(
    playerId: string,
    input: PlayerInputDto,
    inputRequest: number
  ): void {
    this.socket.emit(
      GameEvents.PLAYER_INPUT.name,
      GameEvents.PLAYER_INPUT.getEvent(playerId, input, inputRequest)
    );
  }

  emitGetItemDetails(ids: string[]): Promise<ItemDetailResponse> {
    return new Promise((res) => {
      this.socket.emit(
        GameEvents.ITEM_DETAILS.name,
        GameEvents.ITEM_DETAILS.getEvent(ids),
        (response: ItemDetailResponse) => {
          res(response);
        }
      );
    });
  }
}
