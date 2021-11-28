import { Socket } from "socket.io";
import { ClientConnection } from "../domain/clientConnection";
import { RoomConnection } from "../domain/roomConnection";

export class SocketRoomConnection implements RoomConnection {
  readonly roomName: string;
  readonly socket: Socket;

  constructor(socket: Socket, roomName: string) {
    this.roomName = roomName;
    this.socket = socket;
  }

  join(connection: ClientConnection): void {
    connection.join(this.roomName);
  }

  emit(eventName: string, data: any): void {
    this.socket.to(this.roomName).emit(eventName, data);
  }
}
