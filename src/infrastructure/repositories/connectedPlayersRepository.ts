import { Player } from "../../domain/player/player";

export class ConnectedPlayersRepository {
  private players: Map<string, Player> = new Map();

  savePlayer(playerId: string, player: Player) {
    this.players.set(playerId, player);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }

  getPlayer(playerId: string) {
    return this.players.get(playerId);
  }

  getAll() {
    return this.players;
  }
}
