import { InventoryRepository } from "../../domain/items/inventoryRepository";
import { PlayerInventory } from "../../domain/items/playerInventory";
import { PlayerInfo } from "../../domain/player/playerInfo";

export class InMemoryInventoryRepository implements InventoryRepository {
  private store: { [key: PlayerInfo["id"]]: PlayerInventory } = {};
  save(playerId: string, inventory: PlayerInventory) {
    this.store[playerId] = inventory;
  }
  get(playerId: string): PlayerInventory {
    if (!this.store[playerId])
      throw new Error("Inventory not found for player: " + playerId);
    return this.store[playerId];
  }
}
