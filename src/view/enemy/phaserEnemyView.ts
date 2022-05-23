import { BodyType } from "matter";
import { Physics } from "phaser";
import { Subject } from "rxjs";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";
import { ServerEnemyView } from "../../domain/enemies/ServerEnemyView";
import { Vector } from "../../domain/vector";
import { PhaserEntityView } from "../entity/phaserEntityView";
import { PlatformDetector } from "../environment/platformDetector";

export class PhaserEnemyView
  extends PhaserEntityView
  implements ServerEnemyView
{
  private readonly _onPlatformDetectorEnter = new Subject<Vector>();
  private readonly _onPlatformDetectorLeave = new Subject<Vector>();
  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view, x, y, height, width);
    this.setName("Enemy View");
    this.mainBody.onCollideCallback = ({
      bodyA,
      bodyB,
    }: {
      bodyA: BodyType;
      bodyB: BodyType;
    }) => this.handleDetection(bodyA, bodyB);
  }
  get onPlatformDetectorLeave() {
    return this._onPlatformDetectorLeave;
  }
  get onPlatformDetectorEnter() {
    return this._onPlatformDetectorEnter;
  }

  handleDetection(bodyA: BodyType, bodyB: BodyType) {
    const otherBody = bodyA.id === this.matterBody.id ? bodyB : bodyA;
    if (otherBody.type !== PlatformDetector.Type) return;

    this._onPlatformDetectorEnter.next(otherBody.position);
  }
}
