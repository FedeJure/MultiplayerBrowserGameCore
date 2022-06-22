import {
  PlayerInventoryDto,
} from "./playerInventoryDto";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { Delegator } from "../delegator";
import { ServerPlayer } from "../player/players/serverPlayer";
import { AsyncRepository, SimpleRepository } from "../repository";
import { DefaultItem, Item } from "../items/item";
import { DefaultPlayerInventory } from "../../infrastructure/configuration/DefaultPlayerInventory";
import { BalanceDto } from "./balanceDto";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    private itemsRepository: AsyncRepository<Item>,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
    private playerBalanceRepository: AsyncRepository<BalanceDto>
  ) {}
  init(): void {
    this.inGamePlayersRepository.onSave.subscribe(async (player) => {
      try {
        const connection = player.connection;
        if (!connection) return;
        connection.onItemDetailRequest().subscribe(async (ev) => {
          const items = await (
            await Promise.all(
              ev.ev.itemIds.map((id) => this.itemsRepository.get(id))
            )
          ).map((item) => item ?? DefaultItem);
          ev.callback(GameEvents.ITEM_DETAILS_RESPONSE.getEvent(items));
        });
        const inventory = await this.inventoryRepository.get(player.info.id);
        connection.sendInventoryBalanceEvent(inventory || DefaultPlayerInventory);

        this.inventoryRepository.onSave.subscribe((inventory) => {
          connection.sendInventoryBalanceEvent(inventory);
        });

        this.playerBalanceRepository.onSave.subscribe((balance) => {
          connection.sendInventoryBalanceEvent(undefined, balance);
        })
      } catch (error: any) {
        Log("ServerPlayerInventoryDelegator [Error]:  ", error);
      }
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
