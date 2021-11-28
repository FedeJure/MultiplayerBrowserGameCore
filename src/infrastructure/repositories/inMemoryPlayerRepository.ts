import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayerInfoRepository } from "./playerInfoRepository";

export class InMemoryPlayerRepository implements PlayerInfoRepository {
  store: Map<string, PlayerInfo> = new Map();

  getPlayer(id: string): PlayerInfo | undefined {
    return this.store.has(id) ? this.store.get(id) : undefined;
  }

  addPlayer(id: string, info: PlayerInfo) {
    this.store.set(id, info);
  }
}
