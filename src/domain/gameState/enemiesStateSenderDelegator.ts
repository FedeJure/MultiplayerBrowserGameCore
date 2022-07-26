import { Socket } from "socket.io";
import { EnemyDataDto } from "../../infrastructure/dtos/enemyStatesDto";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Delegator } from "../delegator";
import { Enemy } from "../enemies/enemy";
import { SimpleRepository } from "../repository";
import { RoomManager } from "../roomManager";

export class EnemiesStateSenderDelegator implements Delegator {
  constructor(
    private roomManager: RoomManager,
    private socket: Socket,
    private enemiesRepository: SimpleRepository<Enemy>
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {
    const enemiesByRoom = this.roomManager.getEnemiesByRoom();
    for (const room in enemiesByRoom) {
      if (Object.prototype.hasOwnProperty.call(enemiesByRoom, room)) {
        const enemies: EnemyDataDto = {
          enemies: (enemiesByRoom[room] ?? [])
            .map(this.enemiesRepository.get.bind(this.enemiesRepository))
            .filter((e) => e)
            .map((enemy) => ({
              state: enemy!.state,
              info: enemy!.info,
              stats: enemy!.stats,
            })),
        };

        this.socket
          .in(room)
          .emit(
            GameEvents.ENEMIES_CREATION.name,
            GameEvents.ENEMIES_CREATION.getEvent(enemies)
          );
      }
    }
  }
}
