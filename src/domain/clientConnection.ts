import { Observable } from "rxjs";
import { PlayerInitialStateDto } from "../infrastructure/dtos/playerInitialStateDto";
import { PlayerInputEvent } from "../infrastructure/events/gameEvents";

export interface ClientConnection {
  connectionId: string;
  connectionTime: Date;
  onPlayerConnection(): Observable<{ playerId: string }>;
  sendInitialStateEvent(players: PlayerInitialStateDto[]): void;
  join(roomName: string): void;
  onInput(): Observable<PlayerInputEvent>;
}
