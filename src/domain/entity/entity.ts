import { Attackable } from "../combat/attackTarget";
import { CombatResult } from "../player/combat/combatResult";
import { EntityAnimationCode, AnimationLayer } from "./animations";
import { DefaultEntityAnimations } from "./DefaultEntityAnimations";
import { DefaultEntityCombat } from "./DefaultEntityCombat";
import { DefaultEntityMovement } from "./DefaultMovement";
import { EntityAnimations } from "./EntityAnimations";
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
  Movement extends EntityMovement = EntityMovement,
  Animations extends EntityAnimations = EntityAnimations
> implements Attackable
{
  constructor(
    protected _info: Info,
    protected _state: State,
    protected _view: View,
    protected _stats: Stats,
    protected _movement: Movement = new DefaultEntityMovement() as any as Movement,
    protected _combat: Combat = new DefaultEntityCombat() as any as Combat,
    protected _animations: Animations = new DefaultEntityAnimations() as any as Animations
  ) {
    this._movement.init(this);
    this._combat.init(this);
    this._animations.init(this);
  }

  updateInfo(newInfo: Partial<Info>) {
    this._info = { ...this.info, ...newInfo };
  }

  updateState(newState: Partial<State>) {
    this._state = { ...this.state, ...newState };
  }

  destroy() {
    console.log("Destroy")
    this._view.destroy();
  }

  update(time: number, delta: number) {
    if (this.state.isAlive) {
      this.combat.update(time, delta);
      this.movement.update(time, delta);
    }
    this._animations.update(time, delta);
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

  get animations() {
    return this._animations;
  }
}
