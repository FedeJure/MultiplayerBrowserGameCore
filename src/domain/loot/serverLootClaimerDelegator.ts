import { Log } from "../../infrastructure/Logger";
import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { Item } from "../items/item";
import { ServerPlayer } from "../player/players/serverPlayer";
import { AsyncRepository, SimpleRepository } from "../repository";
import { Loot } from "./loot";

export class ServerLootClaimerDelegator implements Delegator {
  private disposer: Disposer = new Disposer();
  constructor(
    private lootsRepository: SimpleRepository<Loot>,
    private inGamePlayersRepository: SimpleRepository<ServerPlayer>,
    private itemsRepository: AsyncRepository<Item>
  ) {}
  init(): void {
    this.inGamePlayersRepository.onSave.subscribe(async (player) => {
      try {
        const connection = player.connection;
        if (!connection) return;
        this.disposer.add(
          connection
            .onClaimLoot()
            .subscribe(({ lootId, lootIndexes, balance }) => {
              const loot = this.lootsRepository.get(lootId);
              if (!loot) return;
              const itemsToLoot = lootIndexes
                .map((lootIndex) => loot.itemIds[lootIndex])
                .filter((itemId) => itemId !== undefined) as Item["id"][];
              Promise.all(
                itemsToLoot.map((itemId) => this.itemsRepository.get(itemId))
              ).then((items) => {
                items.forEach((item) => {
                  if (!item) return;
                  player.inventory.addItem(item);
                });
              });
              player.balance.add(balance);
            })
        );
      } catch (error: any) {
        Log("ServerPlayerInventoryDelegator [Error]:  ", error);
      }
    });
  }
  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
