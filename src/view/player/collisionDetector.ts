import { BodyType } from "matter";
import { Scene } from "phaser";
import { Observable, Subject } from "rxjs";

const LABEL = "CollisionDetector";

export class CollisionDetector {
  private activeCollisions: { [key: number]: true } = {};
  private activeCollisionsCount: number = 0;
  private readonly _onCollideChange: Subject<boolean> = new Subject();
  private readonly _onCollidesStart: Subject<BodyType> = new Subject();
  private readonly _onCollidesEnd: Subject<BodyType> = new Subject();
  constructor(
    scene: Scene,
    public readonly body: BodyType
  ) {
    body.isSensor = true;
    body.label = LABEL;
    body.onCollideCallback = this.handleCollisionStart.bind(this);
    body.onCollideEndCallback = this.handleCollisionEnd.bind(this);
  }

  private handleCollisionStart(
    pair: Phaser.Types.Physics.Matter.MatterCollisionPair
  ) {
    this.addColision(pair.bodyA.id);
    this.addColision(pair.bodyB.id);
    const otherBody = pair.bodyA.id === this.body.id ? pair.bodyB : pair.bodyA;
    this._onCollidesStart.next(otherBody);
  }

  private handleCollisionEnd(
    pair: Phaser.Types.Physics.Matter.MatterCollisionPair
  ) {
    this.removeCollision(pair.bodyA.id);
    this.removeCollision(pair.bodyB.id);
    const otherBody = pair.bodyA.id === this.body.id ? pair.bodyB : pair.bodyA;
    this._onCollidesEnd.next(otherBody);
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

  disable() {
    // Sleeping.set(this.body, true)
  }

  enable() {
    // Sleeping.set(this.body, false)
  }

  public get onCollideChange(): Observable<boolean> {
    return this._onCollideChange;
  }

  public get onCollideStart(): Observable<BodyType> {
    return this._onCollidesStart;
  }

  public get onCollideEnd(): Observable<BodyType> {
    return this._onCollidesEnd;
  }
}
