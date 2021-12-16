import { PlayerStateRepository } from "../../infrastructure/repositories/playerStateRepository";
import { Delegator } from "../delegator";
import { Player } from "../player/player";
import { ServerConnection } from "../serverConnection";

export class CurrentMapDelegator implements Delegator {
  public constructor(
    private localPlayer: Player,
    private connection: ServerConnection,
    private statesRepository: PlayerStateRepository
  ) {}
  init(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  update(time: number, delta: number): void {
    throw new Error("Method not implemented.");
  }
}
