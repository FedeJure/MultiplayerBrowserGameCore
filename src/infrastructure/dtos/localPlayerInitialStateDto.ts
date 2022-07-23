import { BalanceDto } from "../../domain/inventory/balanceDto";
import { PlayerInventoryDto } from "../../domain/inventory/playerInventoryDto";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayerState } from "../../domain/player/playerState";
import { PlayerStats } from "../../domain/player/playerStats";

export interface LocalPlayerInitialStateDto {
  id: string;
  state: PlayerState;
  info: PlayerInfo;
  stats: PlayerStats;
  inventory: PlayerInventoryDto;
  balance: BalanceDto;
}
