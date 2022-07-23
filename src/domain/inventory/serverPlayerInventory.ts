import { get } from "mongoose";
import { Item } from "../items/item";
import { PlayerInfo } from "../player/playerInfo";
import { AsyncRepository } from "../repository";
import { Inventory } from "./inventory";
import { PlayerInventoryDto } from "./playerInventoryDto";

export class ServerPlayerInventory extends Inventory<Item['id']> {
  constructor(
    private playerId: PlayerInfo['id'],
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    initialItems: (string | null | undefined)[],
    capacity: number
  ) {
    super(capacity);
    this.setItems(initialItems);
  }

  setItems(itemIds: (Item['id'] | undefined | null)[]): void {
      super.setItems(itemIds)
      this.inventoryRepository.update(this.playerId, this.dto)
  }
  addItem(item: Item['id']): void {
      super.addItem(item)
      this.inventoryRepository.update(this.playerId, this.dto)
  }

  get dto(): PlayerInventoryDto {
    return {
      items: this.items
    }
  }
}
