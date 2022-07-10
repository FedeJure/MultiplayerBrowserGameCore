import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { Delegator } from "../delegator";
import { ServerPlayer } from "../player/players/serverPlayer";
import { AsyncRepository, SimpleRepository } from "../repository";
import { DefaultItem, Item } from "../items/item";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private itemsRepository: AsyncRepository<Item>,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
  ) {}
  init(): void {
    this.inGamePlayersRepository.onSave.subscribe(async (player) => {
      try {
        const connection = player.connection;
        if (!connection) return;
        connection.onItemDetailRequest().subscribe(async (ev) => {
          const items = await (
            await Promise.all(
              ev.ev.itemIds.map((id) => this.itemsRepository.getBy({id}))
            )
          ).map((item) => item ?? DefaultItem);
          ev.callback(GameEvents.ITEM_DETAILS_RESPONSE.getEvent(items));
        });
        connection.sendInventoryBalanceEvent(player.inventory.dto);
        player.inventory.onChange.subscribe(() => {
          connection.sendInventoryBalanceEvent(player.inventory.dto);
        });
        player.balance.onChange.subscribe(() => {
          connection.sendInventoryBalanceEvent(undefined, player.balance.dto);
        });
      } catch (error: any) {
        Log("ServerPlayerInventoryDelegator [Error]:  ", error);
      }
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
