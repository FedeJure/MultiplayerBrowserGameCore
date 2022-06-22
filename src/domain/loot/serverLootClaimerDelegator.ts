import { DefaultGameConfiguration } from "../../infrastructure/configuration/GameConfigurations";
import { Log } from "../../infrastructure/Logger";
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
              if (
                (loot.owner !== player.info.id &&
                  loot.time + DefaultGameConfiguration.lootDuration >
                    Date.now()) ||
                balance !== loot.balance ||
                Phaser.Math.Distance.BetweenPoints(
                  loot.position,
                  player.state.position
                ) > DefaultGameConfiguration.lootDistance
              ) {
                return;
              }

              const itemsToLoot = lootIndexes
                .map((lootIndex) => loot.itemIds[lootIndex])
                .filter((itemId) => itemId !== undefined) as Item["id"][];
              const lootedItems: Item["id"][] = [];
              itemsToLoot.forEach((itemId) => {
                try {
                  player.inventory.addItem(itemId);
                  lootedItems.push(itemId);
                } catch (error) {}
              });

              if (balance === loot.balance) {
                player.balance.add(balance);
              }

              const unlootedItems = loot.itemIds.filter(
                (itemId) => itemId && !lootedItems.includes(itemId)
              );
              if (unlootedItems.length === 0) {
                this.lootsRepository.remove(loot.id);
                return;
              }

              this.lootsRepository.update(lootId, {
                balance: 0,
                itemIds: loot.itemIds.map((itemId) =>
                  itemId && lootedItems.includes(itemId) ? itemId : undefined
                ),
              });
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
