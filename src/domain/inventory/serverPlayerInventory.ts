import { Item } from "../items/item";
import { PlayerInfo } from "../player/playerInfo";
import { AsyncRepository } from "../repository";
import { PlayerInventory } from "./playerInventory";
import { PlayerInventoryDto } from "./playerInventoryDto";

export class ServerPlayerInventory extends PlayerInventory {
  constructor(
    private playerId: PlayerInfo['id'],
    private inventoryRepository: AsyncRepository<PlayerInventoryDto>,
    capacity: number
  ) {
    super(capacity);
  }

  setItems(items: (Item | null)[]): void {
      super.setItems(items)
      this.inventoryRepository.save(this.playerId, this.dto)
  }
  addItem(item: Item): void {
      super.addItem(item)
      this.inventoryRepository.save(this.playerId, this.dto)
  }
}
