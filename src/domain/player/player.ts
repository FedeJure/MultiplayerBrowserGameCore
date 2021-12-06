import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";
import { IPlayerView } from "../../presentation/playerView";

export class Player {
  private _state: PlayerState;
  public readonly info: PlayerInfo;
  public readonly view: IPlayerView;

  constructor(
    playerInfo: PlayerInfo,
    playerState: PlayerState,
    playerView: IPlayerView
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
