import { Scene } from "phaser";
import { Observable, Subject } from "rxjs";

const LABEL = "CollisionDetector";
type Body = Phaser.Physics.Arcade.Body

export class CollisionDetector {
  private activeCollisions: { [key: number]: true } = {};
  private activeCollisionsCount: number = 0;
  private readonly _onCollideChange: Subject<boolean> = new Subject();
  private readonly _onCollidesStart: Subject<Body> = new Subject();
  private readonly _onCollidesEnd: Subject<Body> = new Subject();
  constructor(scene: Scene, public readonly body: Phaser.Physics.Arcade.Body) {
    body.onOverlap = true;
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
  }

  enable() {
  }

  public get onCollideChange(): Observable<boolean> {
    return this._onCollideChange;
  }

  public get onCollideStart(): Observable<Body> {
    return this._onCollidesStart;
  }

  public get onCollideEnd(): Observable<Body> {
    return this._onCollidesEnd;
  }
}
