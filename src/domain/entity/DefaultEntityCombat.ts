import { CombatResult } from "../player/combat/combatResult";
import { Entity } from "./entity";
import { EntityCombat } from "./entityCombat";

export class DefaultEntityCombat implements EntityCombat {
  private entity: Entity;
  
  init(entity: Entity) {
    this.entity = entity;
  }
  update(time: number, delta: number) {
    this.entity.view.setLifePercent(
      (this.entity.state.life / this.entity.stats.maxLife) * 100
    );
    this.entity.view.setLevel(
      this.entity.stats.level
    );
  }
  receiveAttack(attack: CombatResult) {}
}
