import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { ServerConnection } from "../serverConnection";

export class CurrentMapDelegator implements Delegator {
  public constructor(
    private localPlayerId: string,
    private connection: ServerConnection,
    private statesRepository: PlayerStateRepository
  ) {}
  init(): void {}
  stop(): void {}
  update(time: number, delta: number): void {}
}
