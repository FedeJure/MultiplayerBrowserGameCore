import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { Delegator } from "../delegator";
import { InGamePlayersRepository } from "../player/inGamePlayersRepository";
import { ServerPlayer } from "../player/serverPlayer";
import { InventoryRepository } from "./inventoryRepository";
import { DefaultItem } from "./item";
import { ItemsRepository } from "./itemsRepository";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private inventoryRepository: InventoryRepository,
    private itemsRepository: ItemsRepository,
    private inGamePlayersRepository: InGamePlayersRepository
  ) {}
  init(): void {
    this.inGamePlayersRepository.onNewPlayer.subscribe((player) => {
      try {
        const serverPlayer = player as ServerPlayer
        const connection = serverPlayer.connection;
        if (!connection) return;
        connection.onItemDetailRequest().subscribe((ev) => {
          const items = ev.ev.itemIds.map(
            (id) => this.itemsRepository.get(id) ?? DefaultItem
          );
          ev.callback(GameEvents.ITEM_DETAILS_RESPONSE.getEvent(items));
        });
        const inventory = this.inventoryRepository.get(serverPlayer.info.id);

        connection.sendInventoryEvent(inventory);
      } catch (error: any) {
        Log("ServerPlayerInventoryDelegator [Error]:  ", error);
      }
    })
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
