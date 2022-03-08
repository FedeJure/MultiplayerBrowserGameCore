import { Socket } from "socket.io";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { RoomManager } from "../roomManager";

export class PlayerStateDelegator implements Delegator {
  constructor(
    private roomManager: RoomManager,
    private playerStates: PlayerStateRepository,
    private socket: Socket
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    const playersByRoom = this.roomManager.getPlayersByRoom();
    for (const roomId in playersByRoom) {
      if (Object.prototype.hasOwnProperty.call(playersByRoom, roomId)) {
        const players = playersByRoom[roomId] ?? [];
        const states = {};

        for (let i = 0; i < players.length; i++) {
          const p = players[i];
          const state = this.playerStates.getPlayerState(p);
          if (state) states[p] = state;
        }

        this.socket
          .in(roomId)
          .emit(
            GameEvents.PLAYERS_STATES.name,
            GameEvents.PLAYERS_STATES.getEvent(states)
          );
      }
    }
  }
}