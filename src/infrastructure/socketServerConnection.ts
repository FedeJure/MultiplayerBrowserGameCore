import { Observable, Subject } from "rxjs";
import { Socket } from "socket.io-client";
import { EnvironmentObjectRepository } from "../domain/environmentObjects/environmentObjectRepository";

import { ServerConnection } from "../domain/serverConnection";
import { PlayerInputDto } from "./dtos/playerInputDto";
import {
  EnvironmentObjectDetailsResponse,
  GameEvents,
  InitialGameStateEvent,
  InventoryUpdatedEvent,
  ItemDetailResponse,
  MapUpdateEvent,
  NewPlayerConnectedEvent,
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
  private readonly _onInventoryUpdated = new Subject<InventoryUpdatedEvent>();

  constructor(socket: Socket) {
    this.socket = socket;

    socket.on(GameEvents.INITIAL_GAME_STATE.name, (data) =>
      this._onInitialGameState.next(data)
    );
    socket.on(GameEvents.NEW_PLAYER_CONNECTED.name, (data) =>
      this._onNewPlayerConnected.next(data)
    );
    socket.on(GameEvents.PLAYERS_STATES.name, (data) =>
      this._onPlayersStates.next(data)
    );
    socket.on(GameEvents.PLAYER_DISCONNECTED.name, (data) =>
      this._onPlayerDisconnected.next(data)
    );
    socket.on(GameEvents.MAP_UPDATE.name, (data) =>
      this._onMapUpdated.next(data)
    );
    socket.on(GameEvents.INVENTORY_UPDATED.name, (data) =>
      this._onInventoryUpdated.next(data)
    );

    var startTime = Date.now();
    socket.on(SocketIOEvents.PONG, (data) =>
      this._onPing.next(Date.now() - startTime)
    );
    setInterval(() => {
      startTime = Date.now();
      socket.emit(SocketIOEvents.PING);
    }, 2000);
  }

  emitGetEnvironmentObjectsDetails(ids: number[]): Promise<EnvironmentObjectDetailsResponse> {
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

  emitStartNewConnection(playerId: string): void {
    this.socket.emit(
      GameEvents.PLAYER_CONNECTED.name,
      GameEvents.PLAYER_CONNECTED.getEvent(playerId)
    );
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
