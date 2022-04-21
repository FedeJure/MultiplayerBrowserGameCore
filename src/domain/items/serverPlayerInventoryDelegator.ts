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
    private inGamePlayersRepository: InGamePlayersRepository<ServerPlayer>
  ) {}
  init(): void {
    this.inGamePlayersRepository.onNewPlayer.subscribe((player) => {
      try {
        const connection = player.connection;
        if (!connection) return;
        connection.onItemDetailRequest().subscribe((ev) => {
          const items = ev.ev.itemIds.map(
            (id) => this.itemsRepository.get(id) ?? DefaultItem
          );
          ev.callback(GameEvents.ITEM_DETAILS_RESPONSE.getEvent(items));
        });
        const inventory = this.inventoryRepository.get(player.info.id);

        connection.sendInventoryEvent(inventory);
      } catch (error: any) {
        Log("ServerPlayerInventoryDelegator [Error]:  ", error);
      }
    })
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
