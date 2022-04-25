import { PlayerView } from "../../playerView";
import { PlayerInfo } from "../playerInfo";
import { Player } from "./player";
import { PlayerState } from "../playerState";

export class ClientPlayer implements Player {
  constructor(
    private _info: PlayerInfo,
    private _state: PlayerState,
    private _view: PlayerView,
  ) {}

  updateInfo(newInfo: Partial<PlayerInfo>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<PlayerState>) {
    this._state = { ...this.state, ...newState };
  }

  destroy() {
    this._view.destroy();
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

  update(time: number, delta: number) {
      this.view.playAnimation(this.state.anim)
      this.view.setPosition(this.state.position.x, this.state.position.y)
      this.view.setVelocity(this.state.velocity.x, this.state.velocity.y)
  }
}
