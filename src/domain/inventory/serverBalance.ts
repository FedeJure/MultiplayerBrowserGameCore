import { PlayerInfo } from "../player/playerInfo";
import { AsyncRepository } from "../repository";
import { Balance } from "./balance";
import { BalanceDto } from "./balanceDto";

export class ServerBalance extends Balance {
  constructor(
    private playerId: PlayerInfo["id"],
    private balanceRepository: AsyncRepository<BalanceDto>
  ) {
    super();
  }

  set(amount: number): void {
    super.set(amount);
    this.balanceRepository.save(this.playerId, this.dto);
  }

  substract(amount: number): void {
    super.substract(amount);
    this.balanceRepository.save(this.playerId, this.dto);
  }

  add(amount: number): void {
    super.add(amount);
    this.balanceRepository.save(this.playerId, this.dto);
  }
}
