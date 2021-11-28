import { ClientConnection } from "./clientConnection";

export interface RoomConnection {
  join(connection: ClientConnection): void;
  emit(eventName: string, data: any): void;
}
