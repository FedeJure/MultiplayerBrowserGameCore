import { BodyType } from "matter";
import { GameObjects, Physics } from "phaser";
import { Observable } from "rxjs";
import {
  CollisionCategory,
} from "../../domain/collisions/collisionTypes";
import { PlayerView } from "../../domain/playerView";
import { CollisionDetector } from "./collisionDetector";
import { ExistentDepths } from "../existentDepths";
import {
  AnimationCode,
  AnimationLayer,
} from "../../domain/animations/animations";
import { PhaserCombatCollisionResolver } from "./combatCollisionResolver";

export class PhaserPlayerView
  extends GameObjects.Container
  implements PlayerView
{
  protected readonly _view: Physics.Matter.Sprite;
  private readonly groundCollisionDetector: CollisionDetector;

  constructor(
    view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number,
    public readonly combatCollisionResolver: PhaserCombatCollisionResolver
  ) {
    super(view.scene, x, y, [view]);
    this.setName("Player View");
    this.setSize(width, height);
    this.setDisplaySize(width, height)
    this.scene.add.existing(this);
    this._view = view;
    this.scene.add.existing(this._view);
    this._view.scene.matter.add.gameObject(this);
    this.selfAsPhysic.setBounce(0);

    this._view.displayOriginX = 0;
    this._view.displayOriginY = 0;
    this._view.setPosition(0, 0);

    this.groundCollisionDetector = new CollisionDetector(
      this.scene,
      this.scene.matter.bodies.rectangle(
        this.x,
        this.y + this.height / 2 + 1,
        this.width / 2,
        2
      )
    );
    this.setDepth(ExistentDepths.GROUND);

    this.initCollisions();
  }
  setLifePercent(percent: number) {
  }

  playAnimation(anim: AnimationCode, animLayer: AnimationLayer) {}
  setDisplayName(name: string) {}

  get positionVector(): MatterJS.Vector {
    return { x: this.x, y: this.y };
  }

  get selfAsPhysic() {
    return this as unknown as Phaser.Physics.Matter.Sprite &
      GameObjects.Container;
  }

  get matterBody() {
    return this.body as BodyType;
  }

  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this, false, 0.1, 0.1);
  }
  get velocity(): MatterJS.Vector {
    return this.matterBody.velocity;
  }

  lookToLeft(value: boolean): void {
    this._view.setScale(
      (value ? -1 : 1) * Math.abs(this._view.scaleX),
      this._view.scaleY
    );
  }
  setVelocity(x: number, y: number): void {
    this.selfAsPhysic.setVelocity(x, y);
  }
  private initCollisions() {
    const body = this.scene.matter.body.create({
      parts: [this.matterBody, this.groundCollisionDetector.body],
    });
    this.selfAsPhysic.setExistingBody(body);
    this.scene.matter.setCollisionGroup(
      [this.matterBody],
      -CollisionCategory.Player
    );
    this.scene.matter.setCollisionCategory(
      [this.matterBody],
      CollisionCategory.Player
    );
    this.scene.matter.setCollidesWith(
      [this.matterBody],
      [
        CollisionCategory.StaticEnvironment,
        CollisionCategory.WorldBounds,
        CollisionCategory.DamageArea,
      ]
    );
  }

  public get view() {
    return this._view;
  }

  public get onGroundCollideChange(): Observable<boolean> {
    return this.groundCollisionDetector.onCollideChange;
  }
}
