import { Observable, Subject } from "rxjs";
import { Socket } from "socket.io";
import { ClientConnection } from "../domain/clientConnection";
import { PlayerInputEvent } from "./events/gameEvents";
import { PlayerInitialStateDto } from "./dtos/playerInitialStateDto";
export declare class SocketClientConnection implements ClientConnection {
    readonly socket: Socket;
    readonly connectionId: string;
    readonly connectionTime: Date;
    private onPlayerConnectionSubject;
    private onInputSubject;
    constructor(socket: Socket);
    onInput(): Observable<PlayerInputEvent>;
    join(roomName: string): void;
    listenEvents(): void;
    sendInitialStateEvent(players: PlayerInitialStateDto[]): void;
    onPlayerConnection: () => Subject<{
        playerId: string;
    }>;
}
