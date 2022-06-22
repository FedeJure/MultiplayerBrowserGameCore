import { ClientConnection } from "../clientConnection";
import { Delegator } from "../delegator";
import { Disposer } from "../disposer";
import { Item } from "../items/item";
import { ControllablePlayer } from "../player/players/controllablePlayer";
import {  AsyncRepository, SimpleRepository } from "../repository";
import { Loot } from "./loot";

export class ServerLootClaimerDelegator implements Delegator {
  private disposer: Disposer = new Disposer();
  constructor(
    private clientConnection: ClientConnection,
    private lootsRepository: SimpleRepository<Loot>,
    private inGamePlayersRepository: SimpleRepository<ControllablePlayer>,
    private itemsRepository: AsyncRepository<Item>
    
  ) {}
  init(): void {
    if (!this.clientConnection.playerId) return
    const player = this.inGamePlayersRepository.get(this.clientConnection.playerId)
    if (!player) return
    this.disposer.add(
      this.clientConnection
        .onClaimLoot()
        .subscribe(({ lootId, lootIndexes, money }) => {
          const loot = this.lootsRepository.get(lootId);
          if (!loot) return;
          const itemsToLoot = lootIndexes
            .map((lootIndex) => loot.itemIds[lootIndex])
            .filter((itemId) => itemId !== undefined) as Item["id"][];
          Promise.all(itemsToLoot.map(itemId => this.itemsRepository.get(itemId))).then(items => {
            items.forEach(item => {
                if (!item) return
                player.inventory.addItem(item)
            })
          })
          player.inventory.money.add(money)
        })
    );
  }
  stop(): void {
    this.disposer.dispose();
  }
  update(time: number, delta: number): void {}
}
