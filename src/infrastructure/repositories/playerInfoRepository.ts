import { PlayerInfo } from "../../domain/player/playerInfo";

export interface PlayerInfoRepository {
  get(id: string) : Promise<PlayerInfo | undefined>;
  save(id: string, info: PlayerInfo): Promise<void>;
  update(id: string, info: Partial<PlayerInfo>): Promise<void>
}
