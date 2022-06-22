import { Item } from "../items/item";
import { PlayerInfo } from "../player/playerInfo";
import { AsyncRepository } from "../repository";
import { Inventory } from "./inventory";
import { PlayerInventoryDto } from "./playerInventoryDto";

export class ServerPlayerInventory extends Inventory<Item['id']> {
  constructor(
    private playerId: PlayerInfo['id'],
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    capacity: number
  ) {
    super(capacity);
  }

  setItems(itemIds: (Item['id'] | undefined)[]): void {
      super.setItems(itemIds)
      this.inventoryRepository.save(this.playerId, this.dto)
  }
  addItem(item: Item['id']): void {
      super.addItem(item)
      this.inventoryRepository.save(this.playerId, this.dto)
  }

  get dto(): PlayerInventoryDto {
    return {
      items: this.items
    }
  }
}
