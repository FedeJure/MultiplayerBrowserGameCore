import { CombatResult } from "../player/combat/combatResult";
import { AnimationLayer, EntityAnimationCode } from "./animations";
import { Entity } from "./entity";
import { EntityCombat } from "./entityCombat";

export class DefaultEntityCombat implements EntityCombat {
  private entity: Entity;
  private life: number = 0
  init(entity: Entity) {
    this.entity = entity;
  }
  update(time: number, delta: number) {
    if (this.life !== this.entity.state.life) {
      this.entity.view.setLifePercent(
        (this.entity.state.life / this.entity.stats.maxLife) * 100
      );
      this.life = this.entity.state.life
      this.entity.animations.executeAnimation(EntityAnimationCode.TAKING_DAMAGE, AnimationLayer.COMBAT, false)
    }
    this.entity.view.setLevel(this.entity.stats.level);
  }
  receiveAttack(attack: CombatResult) {}

  bringExperience(exp: number) {}
}
