import { Observable, Subject } from "rxjs";
import { Socket } from "socket.io";
import { ClientConnection } from "../domain/clientConnection";
import {
  ClaimLootEvent,
  EnvironmentObjectDetailsRequest,
  EnvironmentObjectDetailsResponse,
  GameEvents,
  ItemDetailRequest,
  ItemDetailResponse,
  PlayerConnectedEvent,
  PlayerConnectionResponseEvent,
  PlayerInputEvent,
} from "./events/gameEvents";
import { Log } from "./Logger";
import { SocketIOEvents } from "./events/socketIoEvents";
import { PlayerInitialStateDto } from "./dtos/playerInitialStateDto";
import { ProcessedMap } from "../domain/environment/processedMap";
import { PlayerInventoryDto } from "../domain/inventory/playerInventoryDto";
import { LocalPlayerInitialStateDto } from "./dtos/localPlayerInitialStateDto";
import { Loot } from "../domain/loot/loot";
import { BalanceDto } from "../domain/inventory/balanceDto";

export class SocketClientConnection implements ClientConnection {
  public readonly socket: Socket;
  public readonly connectionId: string;
  public readonly connectionTime: Date;

  private onPlayerConnectionSubject = new Subject<{
    playerId: string;
    callback: (ev: PlayerConnectionResponseEvent) => void;
  }>();
  private onInputSubject = new Subject<PlayerInputEvent>();
  private onItemDetailRequestSubject = new Subject<{
    ev: ItemDetailRequest;
    callback: (ev: ItemDetailResponse) => void;
  }>();
  private onEnvironmentObjectDetailRequestSubject = new Subject<{
    ev: EnvironmentObjectDetailsRequest;
    callback: (ev: EnvironmentObjectDetailsResponse) => void;
  }>();
  private _onClaimLoot = new Subject<ClaimLootEvent>();
  private currentRooms: string[] = [];

  constructor(socket: Socket) {
    this.connectionId = socket.id;
    this.connectionTime = new Date();
    this.socket = socket;

    this.listenEvents();
  }

  listenEvents() {
    this.socket.on(SocketIOEvents.PING, () => {
      this.socket.emit(SocketIOEvents.PONG);
    });
    this.socket.on(GameEvents.PLAYER_CONNECTED.name, (data, callback) => {
      try {
        const { playerId } = data;
        this.onPlayerConnectionSubject.next({
          playerId: playerId.toString(),
          callback,
        });
      } catch (error) {
        Log(this, `[Socket Client Connection] :: Error: ${error}`);
      }
    });
    this.socket.on(GameEvents.PLAYER_INPUT.name, (dto) => {
      this.onInputSubject.next(dto);
    });
    this.socket.on(GameEvents.ITEM_DETAILS.name, (dto, callback) => {
      this.onItemDetailRequestSubject.next({ ev: dto, callback });
    });

    this.socket.on(GameEvents.CLAIM_LOOT.name, (ev) =>
      this._onClaimLoot.next(ev)
    );
    this.socket.on(
      GameEvents.ENVIRONMENT_OBJECT_DETAILS_REQUEST.name,
      (dto, callback) => {
        this.onEnvironmentObjectDetailRequestSubject.next({
          ev: dto,
          callback,
        });
      }
    );
  }
  onClaimLoot(): Observable<ClaimLootEvent> {
    return this._onClaimLoot;
  }
  sendLootAppear(loots: Loot[]) {
    this.socket.emit(
      GameEvents.LOOT_APPEAR.name,
      GameEvents.LOOT_APPEAR.getEvent(loots)
    );
  }
  sendLootDisappear(loots: Loot[]) {
    this.socket.emit(
      GameEvents.LOOT_DISAPPEAR.name,
      GameEvents.LOOT_DISAPPEAR.getEvent(loots)
    );
  }
  playerId?: string;
  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  onItemDetailRequest(): Observable<{
    ev: ItemDetailRequest;
    callback: (ev: ItemDetailResponse) => void;
  }> {
    return this.onItemDetailRequestSubject;
  }

  onEnvironmentObjectRequest(): Observable<{
    ev: EnvironmentObjectDetailsRequest;
    callback: (ev: EnvironmentObjectDetailsResponse) => void;
  }> {
    return this.onEnvironmentObjectDetailRequestSubject;
  }

  sendConnectedPlayer(player: PlayerInitialStateDto) {
    this.socket.emit(
      GameEvents.NEW_PLAYER_CONNECTED.name,
      GameEvents.NEW_PLAYER_CONNECTED.getEvent(player)
    );
  }

  sendInventoryBalanceEvent(
    inventory?: PlayerInventoryDto,
    balance?: BalanceDto
  ) {
    this.socket.emit(
      GameEvents.INVENTORY_UPDATED.name,
      GameEvents.INVENTORY_UPDATED.getEvent(inventory, balance)
    );
  }

  sendMapUpdateEvent(
    newCurrentMap: ProcessedMap,
    neighborMaps: ProcessedMap[]
  ) {
    this.socket.emit(
      GameEvents.MAP_UPDATE.name,
      GameEvents.MAP_UPDATE.getEvent(newCurrentMap, neighborMaps)
    );
  }

  onInput(): Observable<PlayerInputEvent> {
    return this.onInputSubject;
  }

  async join(roomName: string[]): Promise<{ previousRooms: string[] }> {
    const previousRooms = this.currentRooms;
    this.currentRooms.forEach((r) => this.socket.leave(r));
    this.currentRooms = [...roomName];
    await this.socket.join(roomName);
    return { previousRooms };
  }

  public sendInitialStateEvent(
    localPlayer: LocalPlayerInitialStateDto,
    players: PlayerInitialStateDto[],
    currentMap: ProcessedMap | undefined,
    neighborMaps: ProcessedMap[] | undefined
  ) {
    this.socket.emit(
      GameEvents.INITIAL_GAME_STATE.name,
      GameEvents.INITIAL_GAME_STATE.getEvent(
        localPlayer,
        players,
        currentMap,
        neighborMaps
      )
    );
  }

  onPlayerConnection = () => this.onPlayerConnectionSubject;
}
