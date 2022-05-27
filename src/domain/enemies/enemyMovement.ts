import { AnimationLayer } from "../entity/animations";
import { DefaultEntityMovement } from "../entity/DefaultMovement";
import { Side } from "../side";
import { Vector } from "../vector";
import { ServerEnemy } from "./serverEnemy";

enum Actions {
  IDLE = "idle",
  WALK_LEFT = "walk_left",
  WALK_RIGHT = "walk_right",
  FOLLOW_TARGET = "follow_target",
}

const NonCombatAction = [Actions.IDLE, Actions.WALK_LEFT, Actions.WALK_RIGHT];

export class EnemyMovement extends DefaultEntityMovement {
  private currentAction: Actions = Actions.IDLE;
  private nextTimeDecide: number = 0;
  private readonly intervalTimeCheck = 100;
  private lastTimeCheck = 0;
  private platformDetectors: Vector[] = [];
  private initialPosition: Vector;
  private maxDistance: number = 1000;
  private enemy: ServerEnemy;

  init(enemy: ServerEnemy) {
    this.enemy = enemy;
    this.initialPosition = enemy.state.position;
    super.init(enemy);
  }

  resetingMovement(time: number) {
    if (
      this.enemy.state.reseting &&
      Phaser.Math.Distance.BetweenPoints(
        this.enemy.state.position,
        this.initialPosition
      ) < 150
    ) {
      this.enemy.updateState({ reseting: false });
      return;
    }
    this.moveToPosition(time, this.initialPosition);
  }

  update(time: number, delta: number) {
    if (!this.enemy.state.isAlive) return;
    if (
      Phaser.Math.Distance.BetweenPoints(
        this.enemy.state.position,
        this.initialPosition
      ) > this.maxDistance
    ) {
      this.enemy.updateState({ reseting: true });
    }
    // this.updateAnimation();
    if (this.enemy.state.reseting) this.resetingMovement(time);
    else if (this.enemy.combat.target !== null)
      this.resolveCombatMovement(time);
    else this.resolveNotCombatMovements(time);

    this.enemy.updateState({
      position: this.enemy.view.positionVector,
      velocity: this.enemy.view.velocity,
    });

    super.update(time, delta);
  }

  decideNonCombatMove() {
    this.currentAction =
      NonCombatAction[Math.floor(Math.random() * NonCombatAction.length)];
  }

  // updateAnimation() {
  //   const vel = this.enemy.state.velocity;
  //   const xVel = Math.abs(vel.x);
  //   if (xVel < 0.1 || this.enemy.view.blocked) {
  //     this.enemy.updateState({
  //       anim: [{ name: EnemyAnimation.IDLE, layer: AnimationLayer.MOVEMENT }],
  //     });
  //   } else if (xVel <= this.enemy.stats.walkSpeed) {
  //     this.enemy.updateState({
  //       anim: [{ name: EnemyAnimation.WALK, layer: AnimationLayer.MOVEMENT }],
  //     });
  //   } else {
  //     this.enemy.updateState({
  //       anim: [{ name: EnemyAnimation.RUN, layer: AnimationLayer.MOVEMENT }],
  //     });
  //   }
  // }

  resolveNotCombatMovements(time: number) {
    if (time > this.nextTimeDecide) {
      this.decideNonCombatMove();
      this.nextTimeDecide = time + Math.random() * 5000 + 1500;
    }
    if (this.currentAction === Actions.IDLE || this.enemy.view.blocked) {
      this.enemy.view.setVelocity(0, this.enemy.view.velocity.y);
      return;
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

  moveToPosition(
    time: number,
    position: Vector,
    needUseDetectors: boolean = false
  ) {
    const xDirection = position.x - this.enemy.state.position.x;
    const yDirection = position.y - this.enemy.state.position.y;

    if (this.lastTimeCheck + this.intervalTimeCheck < time && yDirection < 0) {
      this.lastTimeCheck = time;
      this.platformDetectors = this.enemy.view.getPlatformDetectorClose();
      if (
        this.platformDetectors.length > 0 &&
        (this.enemy.view.blocked || needUseDetectors)
      ) {
        let closePoint = this.platformDetectors[0];
        let minDistance = Infinity;
        this.platformDetectors.forEach((point) => {
          const distance = Phaser.Math.Distance.BetweenPoints(position, point);
          if (
            point.y <= this.enemy.state.position.y &&
            distance < minDistance
          ) {
            minDistance = distance;
            closePoint = point;
          }
        });
        const distanceToPoint = Phaser.Math.Distance.BetweenPoints(
          this.enemy.state.position,
          closePoint
        );
        this.enemy.view.setPositionInTime(
          closePoint.x,
          closePoint.y,
          distanceToPoint / 0.4
        );
        return;
      }
    }
    const distance = Math.abs(xDirection);
    const sideMultiplier = xDirection / distance;
    this.enemy.updateState({
      side: sideMultiplier > 0 ? Side.RIGHT : Side.LEFT,
    });

    if (distance <= this.enemy.stats.meleeDistance) {
      this.enemy.view.setVelocity(0, this.enemy.state.velocity.y);
      return;
    }

    this.enemy.view.setVelocity(
      this.enemy.stats.runSpeed * sideMultiplier,
      this.enemy.state.velocity.y
    );
  }

  resolveCombatMovement(time: number) {
    const yDirection =
      this.enemy.combat.target!.state.position.y - this.enemy.state.position.y;

    this.moveToPosition(
      time,
      this.enemy.combat.target!.state.position,
      Math.abs(yDirection) > this.enemy.view.height &&
        this.enemy.combat.target!.state.grounded
    );
  }
}
