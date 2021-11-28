import { Player } from "../../domain/player/player";

export class LocalPlayerRepository {
  private _playerId: string;

  constructor(playerId: string) {
    this._playerId = playerId;
  }

  get playerId() {
    return this._playerId;
  }
}
