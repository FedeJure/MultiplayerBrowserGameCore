import { AnimationLayer } from "../entity/animations";
import { Side } from "../side";
import { EnemyAnimation } from "./EnemyAnimations";
import { ServerEnemy } from "./serverEnemy";

enum Actions {
  IDLE = "idle",
  WALK_LEFT = "walk_left",
  WALK_RIGHT = "walk_right",
  FOLLOW_TARGET = "follow_target",
}

const NonCombatAction = [Actions.IDLE, Actions.WALK_LEFT, Actions.WALK_RIGHT];

export class BaseEnemyMovement {
  private currentAction: Actions = Actions.IDLE;
  private nextTimeDecide: number = 0;

  constructor(private enemy: ServerEnemy) {}

  decideNonCombatMove() {
    this.currentAction =
      NonCombatAction[Math.floor(Math.random() * NonCombatAction.length)];
  }

  updateAnimation() {
    const vel = this.enemy.state.velocity;
    if (Math.abs(vel.x) < 0.1) {
      this.enemy.updateState({
        anim: [{ name: EnemyAnimation.IDLE, layer: AnimationLayer.MOVEMENT }],
      });
    } else {
      this.enemy.updateState({
        anim: [{ name: EnemyAnimation.WALK, layer: AnimationLayer.MOVEMENT }],
      });
    }
  }

  update(time: number, delta: number) {
    if (time > this.nextTimeDecide) {
      this.decideNonCombatMove();
      this.nextTimeDecide = time + Math.random() * 5000 + 1500;
    }
    this.updateAnimation();
    if (this.enemy.state.inCombat) {
      if (this.enemy.combat.target) {
      }
    } else {
      if (this.currentAction === Actions.IDLE) {
        this.enemy.view.setVelocity(0, this.enemy.view.velocity.y);
      }
      if (this.currentAction === Actions.WALK_LEFT) {
        this.enemy.updateState({
          side: Side.LEFT,
        });
        this.enemy.view.setVelocity(
          -this.enemy.stats.walkSpeed,
          this.enemy.view.velocity.y
        );
      }
      if (this.currentAction === Actions.WALK_RIGHT) {
        this.enemy.updateState({
          side: Side.RIGHT,
        });
        this.enemy.view.setVelocity(
          this.enemy.stats.walkSpeed,
          this.enemy.view.velocity.y
        );
      }
      
    }
  }
}
