import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";
import { PhaserPlayerView } from "../../view/playerView";

export class Player {
  private _state: PlayerState;
  public readonly info: PlayerInfo;
  public readonly view: PhaserPlayerView;

  constructor(
    playerInfo: PlayerInfo,
    playerState: PlayerState,
    playerView: PhaserPlayerView
  ) {
    this.info = playerInfo;
    this._state = playerState;
    this.view = playerView;
  }

  public get state() {
    return this._state;
  }

  destroy() {
    this.view.destroy();
  }
}
