import { IPlayerView } from "../playerView";
import { PlayerInfo } from "./playerInfo";
import { PlayerState } from "./playerState";

export class Player {
  constructor(
    private _info: PlayerInfo,
    private _state: PlayerState,
    private _view: IPlayerView
  ) {}

  updateInfo(newInfo: Partial<PlayerInfo>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<PlayerState>) {
    this._state = { ...this.state, ...newState };
  }

  destroy() {
    this._view.destroy()
  }

  get info() {
    return this._info;
  }
  get state() {
    return this._state;
  }
  get view() {
    return this._view;
  }
}
