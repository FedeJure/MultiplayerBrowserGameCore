import { Player } from "../../domain/player/player";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { InGamePlayersRepository } from "../../domain/player/inGamePlayersRepository";
import { Subject } from "rxjs";

export class InMemoryInGamePlayerRepository implements InGamePlayersRepository {
  private _onNewPlayer = new Subject<Player>();
  private store: Map<PlayerInfo["id"], Player> = new Map();
  get(id: PlayerInfo["id"]): Player | undefined {
    return this.store[id];
  }
  save(player: Player) {
    this.store[player.info.id] = player;
    this._onNewPlayer.next(player);
  }
  remove(id: PlayerInfo["id"]) {
    delete this.store[id];
  }
  getAll(): Map<string, Player> {
    return this.store;
  }

  get onNewPlayer() {
    return this._onNewPlayer;
  }
}
