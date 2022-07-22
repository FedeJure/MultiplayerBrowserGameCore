import { AnimationLayer, EntityAnimationCode } from "../entity/animations";
import { DefaultEntityAnimations } from "../entity/DefaultEntityAnimations";
import { Enemy } from "./enemy";

export class EnemyAnimation extends DefaultEntityAnimations {
  private enemy: Enemy;
  init(entity: Enemy) {
    super.init(entity);
    this.enemy = entity;
  }
  update() {
    if (!this.entity.state.isAlive) {
      this.executeAnimation(
        EntityAnimationCode.DIE,
        AnimationLayer.MOVEMENT,
        false
      );
      this.executeAnimation(
        EntityAnimationCode.DIE,
        AnimationLayer.COMBAT,
        false
      );
      return;
    }
    if (this.enemy.state.attacking && this.enemy.state.attackAnimation) {
      this.executeAnimation(
        this.enemy.state.attackAnimation.name as EntityAnimationCode,
        this.enemy.state.attackAnimation.layer,
        false
      );
    }
    this.processMovementAnimation();
  }
}
