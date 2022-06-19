import { Socket } from "socket.io";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Delegator } from "../delegator";
import { SimpleRepository } from "../repository";
import { Loot } from "./loot";

export class LootUpdaterDelegator implements Delegator {
  constructor(
    private socket: Socket,
    private lootRepository: SimpleRepository<Loot>,
  ) {}
  init(): void {
    this.lootRepository.onSave.subscribe((loot) => {
      const roomId = loot.mapId.toString();
      this.socket
        .in(roomId)
        .emit(
          GameEvents.LOOT_APPEAR.name,
          GameEvents.LOOT_APPEAR.getEvent([loot])
        );
    });

    this.lootRepository.onRemove.subscribe((loot) => {
        const roomId = loot.mapId.toString();
        this.socket
          .in(roomId)
          .emit(
            GameEvents.LOOT_DISAPPEAR.name,
            GameEvents.LOOT_DISAPPEAR.getEvent([loot])
          );
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
