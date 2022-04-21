import { Player2_0 } from "../../domain/player/player2.0";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { PlayersRepository2_0 } from "../../domain/player/playersRepository2.0";

export class InGamePlayerRepository implements PlayersRepository2_0 {

  private store: Map<PlayerInfo['id'], Player2_0> = new Map();
  get(id: PlayerInfo["id"]): Player2_0 | undefined {
    return this.store[id];
  }
  save(player: Player2_0) {
    this.store[player.info.id] = player;
  }
  remove(id: PlayerInfo["id"]) {
    delete this.store[id];
  }
  getAll(): Map<string, Player2_0> {
    return this.store
}
}
