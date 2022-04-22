import { BodyType } from "matter";
import { Observable, Subject } from "rxjs";
import {
  CollisionCategory,
  CollisionGroups,
} from "../../domain/collisions/collisionTypes";

const LABEL = "CollisionDetector";

export class CollisionDetector {
  private activeCollisions: { [key: number]: true } = {};
  private activeCollisionsCount: number = 0;
  private readonly _onCollideChange: Subject<boolean> = new Subject<boolean>();
  constructor(public readonly body: BodyType) {
    body.isSensor = true;
    body.label = LABEL;
    body.onCollideCallback = this.handleCollisionStart.bind(this);
    body.onCollideEndCallback = this.handleCollisionEnd.bind(this);
    body.collisionFilter = {
      category: CollisionCategory.Player,
      group: CollisionGroups.Player,
      mask: CollisionCategory.StaticEnvironment,
    };
  }

  private handleCollisionStart(
    pair: Phaser.Types.Physics.Matter.MatterCollisionPair
  ) {
    this.addColision(pair.bodyA.id);
    this.addColision(pair.bodyB.id);
  }

  private handleCollisionEnd(
    pair: Phaser.Types.Physics.Matter.MatterCollisionPair
  ) {
    this.removeCollision(pair.bodyA.id);
    this.removeCollision(pair.bodyB.id);
  }

  private addColision(id: number) {
    if (!this.activeCollisions[id]) {
      this.activeCollisions[id] = true;
      if (this.activeCollisionsCount === 0) this._onCollideChange.next(true);
      this.activeCollisionsCount++;
    }
  }
  private removeCollision(id: number) {
    if (this.activeCollisions[id]) {
      delete this.activeCollisions[id];

      this.activeCollisionsCount--;
      if (this.activeCollisionsCount === 0) this._onCollideChange.next(false);
    }
  }

  public get onCollideChange(): Observable<boolean> {
    return this._onCollideChange;
  }
}
