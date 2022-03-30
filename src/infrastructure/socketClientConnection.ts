import { Observable, Subject } from "rxjs";
import { Socket } from "socket.io";
import { ClientConnection } from "../domain/clientConnection";
import {
  GameEvents,
  PlayerConnectedEvent,
  PlayerInputEvent,
} from "./events/gameEvents";
import { Log } from "./Logger";
import { SocketIOEvents } from "./events/socketIoEvents";
import { PlayerInitialStateDto } from "./dtos/playerInitialStateDto";
import { ProcessedMap } from "../domain/environment/processedMap";
import { PlayerInventory } from "../domain/items/playerInventory";
import { Player } from "../domain/player/player";

export class SocketClientConnection implements ClientConnection {
  public readonly socket: Socket;
  public readonly connectionId: string;
  public readonly connectionTime: Date;

  private onPlayerConnectionSubject = new Subject<{ playerId: string }>();
  private onInputSubject = new Subject<PlayerInputEvent>();
  private currentRooms: string[] = [];

  constructor(socket: Socket) {
    this.connectionId = socket.id;
    this.connectionTime = new Date();
    this.socket = socket;

    this.listenEvents();
  }
  sendConnectedPlayer(player: PlayerInitialStateDto) {
    this.socket.emit(
      GameEvents.NEW_PLAYER_CONNECTED.name,
      GameEvents.NEW_PLAYER_CONNECTED.getEvent(player)
    );
  }

  sendInventoryEvent(inventory: PlayerInventory) {
    this.socket.emit(
      GameEvents.INVENTORY_UPDATED.name,
      GameEvents.INVENTORY_UPDATED.getEvent({
        items: inventory.items.map((i) => i.id),
      })
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

  listenEvents() {
    this.socket.on(SocketIOEvents.PING, () => {
      this.socket.emit(SocketIOEvents.PONG);
    });
    this.socket.on(
      GameEvents.PLAYER_CONNECTED.name,
      (data: PlayerConnectedEvent) => {
        try {
          const { playerId } = data;
          this.onPlayerConnectionSubject.next({
            playerId: playerId.toString(),
          });
        } catch (error) {
          Log(this, `[Socket Client Connection] :: Error: ${error}`);
        }
      }
    );
    this.socket.on(GameEvents.PLAYER_INPUT.name, (dto: PlayerInputEvent) => {
      this.onInputSubject.next(dto);
    });
  }

  public sendInitialStateEvent(
    players: PlayerInitialStateDto[],
    currentMap: ProcessedMap | undefined,
    neighborMaps: ProcessedMap[] | undefined
  ) {
    this.socket.emit(
      GameEvents.INITIAL_GAME_STATE.name,
      GameEvents.INITIAL_GAME_STATE.getEvent(players, currentMap, neighborMaps)
    );
  }

  onPlayerConnection = () => this.onPlayerConnectionSubject;
}
