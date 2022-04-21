import { ClientPlayer } from "../../domain/player/player";
import { PlayerInfo } from "../../domain/player/playerInfo";
import { InGamePlayersRepository } from "../../domain/player/inGamePlayersRepository";
import { Subject } from "rxjs";
import { ServerPlayer } from "../../domain/player/serverPlayer";

export class InMemoryInGameServerPlayerRepository implements InGamePlayersRepository<ServerPlayer> {
  private _onNewPlayer = new Subject<ServerPlayer>();
  private store: Map<PlayerInfo["id"], ServerPlayer> = new Map();
  get(id: PlayerInfo["id"]): ServerPlayer | undefined {
    return this.store.get(id);
  }
  save(player: ServerPlayer) {
    this.store.set(player.info.id, player);
    this._onNewPlayer.next(player);
  }
  remove(id: PlayerInfo["id"]) {
    this.store.delete(id)
  }
  getAll(): Map<string, ServerPlayer> {
    return this.store;
  }

  get onNewPlayer() {
    return this._onNewPlayer;
  }
}

export class InMemoryInGameClientPlayerRepository implements InGamePlayersRepository<ClientPlayer> {
  private _onNewPlayer = new Subject<ClientPlayer>();
  private store: Map<PlayerInfo["id"], ClientPlayer> = new Map();
  get(id: PlayerInfo["id"]): ClientPlayer | undefined {
    return this.store.get(id);
  }
  save(player: ClientPlayer) {
    this.store.set(player.info.id, player);
    this._onNewPlayer.next(player);
  }
  remove(id: PlayerInfo["id"]) {
    this.store.delete(id)
  }
  getAll(): Map<string, ClientPlayer> {
    return this.store;
  }

  get onNewPlayer() {
    return this._onNewPlayer;
  }
}
