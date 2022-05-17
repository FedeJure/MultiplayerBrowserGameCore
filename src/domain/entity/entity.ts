import { PlayerInfo } from "../player/playerInfo";
import { PlayerState } from "../player/playerState";
import { Side } from "../side";
import { EntityInfo } from "./entityInfo";
import { EntityState } from "./entityState";
import { EntityView } from "./entityView";

export class Entity {
  constructor(
    protected _info: EntityInfo,
    protected _state: EntityState,
    protected _view: EntityView
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

  update(time: number, delta: number) {
    this.view.playAnimations(this.state.anim);
    this.view.setPosition(this.state.position.x, this.state.position.y);
    this.view.setVelocity(this.state.velocity.x, this.state.velocity.y);
    this.view.lookToLeft(this.state.side === Side.LEFT);
    this.view.setLifePercent((this.state.life / 100) * 100);
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
