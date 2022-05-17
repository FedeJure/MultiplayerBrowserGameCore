import { PlayerView } from "../../playerView";
import { PlayerInfo } from "../playerInfo";
import { PlayerState } from "../playerState";
import { Side } from "../../side";

export class Player {
  constructor(
    protected _info: PlayerInfo,
    protected _state: PlayerState,
    protected _view: PlayerView
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
    this.view.playAnimations(this.state.anim)
    this.view.setPosition(this.state.position.x, this.state.position.y);
    this.view.setVelocity(this.state.velocity.x, this.state.velocity.y);
    this.view.lookToLeft(this.state.side === Side.LEFT);
    this.view.setLifePercent((this.state.life / 100) * 100);
  }
}
