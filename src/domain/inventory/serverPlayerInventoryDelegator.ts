import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { Delegator } from "../delegator";
import { ServerPlayer } from "../player/players/serverPlayer";
import { AsyncRepository, SimpleRepository } from "../repository";
import { DefaultItem, Item } from "../items/item";
import { PlayerInventoryDto } from "./playerInventoryDto";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private itemsRepository: AsyncRepository<Item>,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>
  ) {}
  init(): void {
    this.inGamePlayersRepository.onSave.subscribe(async (player) => {
      try {
        const connection = player.connection;
        if (!connection) return;
        connection.onItemDetailRequest().subscribe(async (ev) => {
          const items = await (
            await Promise.all(
              ev.ev.itemIds.map((id) => this.itemsRepository.getBy({ id }))
            )
          ).map((item) => item ?? DefaultItem);
          ev.callback(GameEvents.ITEM_DETAILS_RESPONSE.getEvent(items));
        });
        connection.onInventoryUpdated().subscribe(({ inventory }) => {
          if (!inventory) return;
          this.updateInventoryFromClientRequest(inventory, player);
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

  private updateInventoryFromClientRequest(
    inventory: PlayerInventoryDto,
    player: ServerPlayer
  ) {
    const currentInventoryDto = player.inventory.dto;
    const filteredCurrentInventory = currentInventoryDto.items.filter(
      (item) => item !== null && item !== undefined
    );
    const filteredNewInventory = inventory.items.filter(
      (item) => item !== null && item !== undefined
    );
    if (filteredCurrentInventory.length !== filteredNewInventory.length) return;
    if (
      !filteredCurrentInventory.every((item) =>
        filteredNewInventory.includes(item)
      )
    )
      return;
    player.inventory.setItems(inventory.items);
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
