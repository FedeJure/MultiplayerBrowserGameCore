import { Player } from "../player/players/player";

export class BaseEnemyCombat {
  private _target: Player | null = null;
  public get target() {
    return this._target;
  }
}
