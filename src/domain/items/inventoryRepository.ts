import { PlayerInfo } from "../player/playerInfo";
import { Item } from "./item";
import { PlayerInventory } from "./playerInventory";

export interface InventoryRepository {
    save(playerId: PlayerInfo['id'], inventory: PlayerInventory)
    contains(id: Item['id'])
}