import { Socket } from "socket.io";
import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { PlayerInputRequestRepository } from "../../infrastructure/repositories/playerInputRequestRepository";
import { Delegator } from "../delegator";
import { PlayerInfo } from "../player/playerInfo";
import { ServerPlayer } from "../player/players/serverPlayer";
import { PlayerState } from "../player/playerState";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";

export class PlayerStateDelegator implements Delegator {
  private timeToSend = DefaultGameConfiguration.playerStatesEventInterval
  private lastTimeSended = 0
  constructor(
    private roomManager: RoomManager,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
    private socket: Socket,
    private requestInputRepository: PlayerInputRequestRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    if (this.lastTimeSended + this.timeToSend > time) return
    this.lastTimeSended = time
    const playersByRoom = this.roomManager.getPlayersByRoom();
    for (const roomId in playersByRoom) {
      if (Object.prototype.hasOwnProperty.call(playersByRoom, roomId)) {
        const players = playersByRoom[roomId] ?? [];
        const states: {[key: PlayerInfo['id']]: PlayerState} = {};

        for (let i = 0; i < players.length; i++) {
          const p = players[i];
          const player = this.inGamePlayersRepository.get(p);
          if (player) states[p] = {...player.state, inputNumber: this.requestInputRepository.getOrCreate(p)};
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
