import { BodyType } from "matter";
import { GameObjects, Physics } from "phaser";
import { Observable } from "rxjs";
import { CollisionCategory } from "../../domain/collisions/collisionTypes";
import { EntityView } from "../../domain/entity/entityView";
import { AnimationDto } from "../../domain/entity/AnimationDto";
import { Vector } from "../../domain/vector";
import { ExistentDepths } from "../existentDepths";
import { CollisionDetector } from "../player/collisionDetector";
import { PhaserCombatCollisionResolver } from "../player/combatCollisionResolver";

export class PhaserEntityView
  extends GameObjects.Container
  implements EntityView
{
  private readonly groundCollisionDetector: CollisionDetector;
  protected readonly mainBody: BodyType

  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number,
    protected collisionResolver?: PhaserCombatCollisionResolver
  ) {
    super(view.scene, x, y, [view]);
    this.setSize(width, height);
    this.setDisplaySize(width, height);
    this.scene.add.existing(this);
    view.displayOriginX = 0;
    view.displayOriginY = 0;
    view.setPosition(0, 0);

    view.scene.matter.add.gameObject(this);
    this.selfAsPhysic.setBounce(0);

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
    this.mainBody = this.body as BodyType;


    this.initCollisions();
  }
  public get matterBody() {return this.body as BodyType};

  setPositionInTime(x: number, y: number, time: number) {
    this.scene.tweens.add({
      targets: this.matterBody,
      duration: time,
      props: { x: { value: x }, y: { value: y } },
    });
  }
  getEntitiesClose(distance: number) {
    return (
      this.collisionResolver?.getTargetsAround(this.x, this.y, distance) ?? []
    );
  }
  playAnimations(anims: AnimationDto[]): void {}
  setLifePercent(percent: number): void {}
  setDisplayName(name: string): void {}
  get velocity() {
    return this.matterBody.velocity;
  }

  protected get selfAsPhysic() {
    return this as unknown as Phaser.Physics.Matter.Sprite &
      GameObjects.Container;
  }

  lookToLeft(value: boolean): void {
    this.view.setScale(
      (value ? -1 : 1) * Math.abs(this.view.scaleX),
      this.view.scaleY
    );
  }
  setVelocity(x: number, y: number): void {
    this.selfAsPhysic.setVelocity(x, y);
  }

  get positionVector(): Vector {
    return { x: this.x, y: this.y };
  }

  private initCollisions() {
    const body = this.scene.matter.body.create({
      parts: [this.matterBody, this.groundCollisionDetector.body],
    });

    body.id = this.matterBody.id;
    this.selfAsPhysic.setExistingBody(body);

    this.scene.matter.setCollisionGroup([body], -CollisionCategory.Entity);
    this.scene.matter.setCollisionCategory([body], CollisionCategory.Entity);
    this.scene.matter.setCollidesWith(
      [body],
      [
        CollisionCategory.StaticEnvironment,
        CollisionCategory.WorldBounds,
        CollisionCategory.DamageArea,
      ]
    );
  }

  public get onGroundCollideChange(): Observable<boolean> {
    return this.groundCollisionDetector.onCollideChange;
  }

  setCollisionResolver(collisionResolver: PhaserCombatCollisionResolver) {
    this.collisionResolver = collisionResolver;
    return this;
  }
}
