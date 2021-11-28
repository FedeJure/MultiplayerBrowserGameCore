import { Socket } from "socket.io";
import { ClientConnection } from "../domain/clientConnection";
import { RoomConnection } from "../domain/roomConnection";
export declare class SocketRoomConnection implements RoomConnection {
    readonly roomName: string;
    readonly socket: Socket;
    constructor(socket: Socket, roomName: string);
    join(connection: ClientConnection): void;
    emit(eventName: string, data: any): void;
}
