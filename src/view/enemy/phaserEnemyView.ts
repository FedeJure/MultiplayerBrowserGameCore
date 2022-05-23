import { BodyType } from "matter";
import { Physics } from "phaser";
import { Subject } from "rxjs";
import { EnemyView } from "../../domain/enemies/EnemyView";
import { Vector } from "../../domain/vector";
import { PhaserEntityView } from "../entity/phaserEntityView";

export class PhaserEnemyView extends PhaserEntityView implements EnemyView {
  private readonly _onPlatformDetectorFound = new Subject<Vector>();
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
  get onPlatformDetectorFound() {
    return this._onPlatformDetectorFound;
  }

  handleDetection(bodyA: BodyType, bodyB: BodyType) {
    const otherBody = bodyA.id === this.matterBody.id ? bodyB : bodyA;
    this._onPlatformDetectorFound.next(otherBody.position)
  }
}
