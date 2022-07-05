import { PlayerInfo } from "../player/playerInfo";
import { BalanceDto } from "./balanceDto";

export interface PlayerBalance extends BalanceDto {
  playerId: PlayerInfo["id"];
}
