import { PlayerInventoryDto } from "../../infrastructure/dtos/playerInventoryDto";
import { PlayerInfo } from "../player/playerInfo";

export interface InventoryRepository {
    save(playerId: PlayerInfo['id'], inventory: PlayerInventoryDto)
    get(playerId: PlayerInfo['id']): PlayerInventoryDto
}