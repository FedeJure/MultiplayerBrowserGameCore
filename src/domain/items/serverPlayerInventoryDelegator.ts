import { DefaultPlayerInventoryDto, PlayerInventoryDto } from "../../infrastructure/dtos/playerInventoryDto";
import { GameEvents } from "../../infrastructure/events/gameEvents";
import { Log } from "../../infrastructure/Logger";
import { Delegator } from "../delegator";
import { InGamePlayersRepository } from "../player/inGamePlayersRepository";
import { ServerPlayer } from "../player/serverPlayer";
import { AsyncRepository } from "../repository";
import { DefaultItem, Item } from "./item";

export class ServerPlayerInventoryDelegator implements Delegator {
  constructor(
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    private itemsRepository: AsyncRepository<Item>,
    private inGamePlayersRepository: InGamePlayersRepository<ServerPlayer>
  ) {}
  init(): void {
    this.inGamePlayersRepository.onNewPlayer.subscribe(async (player) => {
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

        connection.sendInventoryEvent(inventory ?? DefaultPlayerInventoryDto);
      } catch (error: any) {
        Log("ServerPlayerInventoryDelegator [Error]:  ", error);
      }
    });
  }
  stop(): void {}
  update(time: number, delta: number): void {}
}
