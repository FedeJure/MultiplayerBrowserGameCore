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

export class SocketClientConnection implements ClientConnection {
  public readonly socket: Socket;
  public readonly connectionId: string;
  public readonly connectionTime: Date;

  private onPlayerConnectionSubject = new Subject<{ playerId: string }>();
  private onInputSubject = new Subject<PlayerInputEvent>();

  constructor(socket: Socket) {
    this.connectionId = socket.id;
    this.connectionTime = new Date();
    this.socket = socket;

    this.listenEvents();
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

  join(roomName: string): void {
    this.socket.join(roomName);
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

  public sendInitialStateEvent(players: PlayerInitialStateDto[]) {
    this.socket.emit(
      GameEvents.INITIAL_GAME_STATE.name,
      GameEvents.INITIAL_GAME_STATE.getEvent(players)
    );
  }

  onPlayerConnection = () => this.onPlayerConnectionSubject;
}
