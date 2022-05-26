import { Attackable } from "../combat/attackTarget";
import { CombatResult } from "../player/combat/combatResult";
import { Side } from "../side";
import { EntityAnimationCode, AnimationLayer } from "./animations";
import { EntityInfo } from "./entityInfo";
import { EntityState } from "./entityState";
import { EntityStats } from "./entityStats";
import { EntityView } from "./entityView";

export class Entity<
  Info extends EntityInfo = EntityInfo,
  State extends EntityState = EntityState,
  View extends EntityView = EntityView,
  Stats extends EntityStats = EntityStats
> implements Attackable
{
  constructor(
    protected _info: Info,
    protected _state: State,
    protected _view: View,
    protected _stats: Stats
  ) {}
  receiveAttack(attack: CombatResult) {}

  updateInfo(newInfo: Partial<Info>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<State>) {
    this._state = { ...this.state, ...newState };
  }

  destroy() {
    this._view.destroy();
  }

  die() {
    this.updateState({
      isAlive: false,
      anim: [
        {
          name: EntityAnimationCode.DIE,
          layer: AnimationLayer.MOVEMENT,
          duration: 1000,
        },
      ],
    } as Partial<State>);
    this.view.setVelocity(0, this.state.velocity.y);
    setTimeout(() => {
      this.destroy();
    }, 50);
  }

  update(time: number, delta: number) {
    this.view.playAnimations(this.state.anim);
    this.view.setLifePercent((this.state.life / this.stats.maxLife) * 100);
    if (!this.state.isAlive) return;
    this.view.setPosition(this.state.position.x, this.state.position.y);
    this.view.setVelocity(this.state.velocity.x, this.state.velocity.y);
    this.view.lookToLeft(this.state.side === Side.LEFT);
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

  get stats() {
    return this._stats;
  }
}
