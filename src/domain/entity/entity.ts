import { Attackable } from "../combat/attackTarget";
import { CombatResult } from "../player/combat/combatResult";
import { Side } from "../side";
import { EntityAnimationCode, AnimationLayer } from "./animations";
import { DefaultEntityCombat } from "./DefaultEntityCombat";
import { DefaultEntityMovement } from "./DefaultMovement";
import { EntityCombat } from "./entityCombat";
import { EntityInfo } from "./entityInfo";
import { EntityMovement } from "./entityMovement";
import { EntityState } from "./entityState";
import { EntityStats } from "./entityStats";
import { EntityView } from "./entityView";

export class Entity<
  Info extends EntityInfo = EntityInfo,
  State extends EntityState = EntityState,
  View extends EntityView = EntityView,
  Stats extends EntityStats = EntityStats,
  Combat extends EntityCombat = EntityCombat,
  Movement extends EntityMovement = EntityMovement
> implements Attackable
{
  constructor(
    protected _info: Info,
    protected _state: State,
    protected _view: View,
    protected _stats: Stats,
    protected _movement: Movement = new DefaultEntityMovement() as any as Movement,
    protected _combat: Combat = new DefaultEntityCombat() as any as Combat
  ) {
    this._combat.init(this);
    this._movement.init(this);
  }

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
    this.combat.update(time, delta);
    this.movement.update(time, delta);
  }

  receiveAttack(attack: CombatResult) {
    this._combat.receiveAttack(attack);
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

  get combat() {
    return this._combat;
  }

  get movement() {
    return this._movement;
  }
}
