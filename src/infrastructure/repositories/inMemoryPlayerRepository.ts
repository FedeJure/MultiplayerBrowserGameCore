import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayerInfoRepository } from "./playerInfoRepository";

export class InMemoryPlayerRepository implements PlayerInfoRepository {
  store: Map<string, PlayerInfo> = new Map();

  get(id: string): Promise<PlayerInfo | undefined> {
    return Promise.resolve(this.store.has(id) ? this.store.get(id) : undefined);
  }

  save(id: string, info: PlayerInfo) {
    this.store.set(id, info);
    return Promise.resolve();
  }

  update(id: string, info: Partial<PlayerInfo>): Promise<void> {
    const prev = this.store.get(id);
    if (!prev) return Promise.resolve();
    this.save(id, { ...prev, ...info });
    return Promise.resolve();
  }
}
