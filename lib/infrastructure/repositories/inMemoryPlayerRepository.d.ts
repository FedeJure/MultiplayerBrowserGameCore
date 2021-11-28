import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayerInfoRepository } from "./playerInfoRepository";
export declare class InMemoryPlayerRepository implements PlayerInfoRepository {
    store: Map<string, PlayerInfo>;
    getPlayer(id: string): PlayerInfo | undefined;
    addPlayer(id: string, info: PlayerInfo): void;
}
