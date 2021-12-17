import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";

interface RangeHelper {
    min: number
    max: number

}

export class MapResolverDelegator implements Delegator {
  constructor(
    private readonly playerId: string,
    private readonly playerStateRepository: PlayerStateRepository
  ) {
    

  }

  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {}
}
