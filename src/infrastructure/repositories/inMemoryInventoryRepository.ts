import { InventoryRepository } from "../../domain/items/inventoryRepository";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayerInventoryDto } from "../dtos/playerInventoryDto";

export class InMemoryInventoryRepository implements InventoryRepository {
  private store: { [key: PlayerInfo["id"]]: PlayerInventoryDto } = {};
  save(playerId: string, inventory: PlayerInventoryDto) {
    this.store[playerId] = inventory;
  }
  get(playerId: string): PlayerInventoryDto {
    if (!this.store[playerId])
      throw new Error("Inventory not found for player: " + playerId);
    return this.store[playerId];
  }
}
