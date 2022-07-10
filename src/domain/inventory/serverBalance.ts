import { PlayerInfo } from "../player/playerInfo";
import { AsyncRepository } from "../repository";
import { Balance } from "./balance";
import { PlayerBalance } from "./playerBalance";

export class ServerBalance extends Balance {
  constructor(
    private playerId: PlayerInfo["id"],
    private balanceRepository: AsyncRepository<PlayerBalance>
  ) {
    super();
  }

  set(amount: number): void {
    super.set(amount);
    this.balanceRepository.update(this.playerId, this.dto);
  }

  substract(amount: number): void {
    super.substract(amount);
    this.balanceRepository.update(this.playerId, this.dto);
  }

  add(amount: number): void {
    super.add(amount);
    this.balanceRepository.update(this.playerId, this.dto);
  }
}
