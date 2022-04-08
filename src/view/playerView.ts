import { BodyType } from "matter";
import { GameObjects, Physics } from "phaser";
import { Observable } from "rxjs";
import { CollisionCategory, CollisionGroups } from "../domain/collisions/collisionTypes";
import { IPlayerView } from "../domain/playerView";
import { CollisionDetector } from "./collisionDetector";

export class PlayerView extends GameObjects.GameObject implements IPlayerView {
  protected readonly _container: GameObjects.Container;
  protected readonly _physicContainer: Physics.Matter.Sprite &
    GameObjects.Container;
  protected readonly _view: Physics.Matter.Sprite;
  public readonly body: BodyType;
  private readonly groundCollisionDetector: CollisionDetector;
  private currentTween?: Phaser.Tweens.Tween;

  constructor(
    view: Physics.Matter.Sprite,
    private x: number,
    private y: number,
    private height: number,
    private width: number
  ) {
    super(view.scene, "player");
    this.setName("Player View");
    this.scene.add.existing(this);

    this._view = view;
    this.scene.add.existing(this._view);

    this._container = this.scene.add.container(x, y, [view]);
    this._container.setSize(width, height);

    this._physicContainer = this._view.scene.matter.add.gameObject(
      this._container
    ) as unknown as Phaser.Physics.Matter.Sprite & GameObjects.Container;
    this.body = this._container.body as BodyType;
    this._physicContainer.setBounce(0);

    this._container.setDepth(10);
    this._view.displayOriginX = 0;
    this._view.displayOriginY = 0;
    this._view.setPosition(0, 0);

    this.groundCollisionDetector = new CollisionDetector(
      this.scene.matter.bodies.rectangle(
        this.x,
        this.y + this.height / 2 + 1,
        this.width / 2,
        2
      )
    );

    this.initCollisions();
  }
  setAngle(degreeAngle: number): void {
    if (this._container.active) this._container.setAngle(degreeAngle);
  }
  add(children: GameObjects.GameObject): this {
    this._physicContainer.add(children);
    return this;
  }
  get gameObject(): GameObjects.GameObject {
    return this._container;
  }
  moveTo(x: number, y: number, time: number): void {
    if (this.currentTween) {
      this.currentTween.stop();
      this.currentTween.complete();
      this.currentTween = undefined;
    }
    this.currentTween = this.view.scene.tweens.add({
      targets: this._container,
      x,
      y,
      duration: time,
    });
  }
  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this._container, false, 0.1, 0.1);
  }
  playAnimation(anim: string): void {}
  get velocity(): MatterJS.Vector {
    return this.matterBody.velocity;
  }
  get position(): MatterJS.Vector {
    return this.matterBody.position;
  }
  setScale(x: number, y: number): void {
    this._container.setScale(x, y);
  }
  lookToLeft(value: boolean): void {
    this._view.setScale(
      (value ? -1 : 1) * Math.abs(this._view.scaleX),
      this._view.scaleY
    );
  }
  setVelocity(x: number, y: number): void {
    this._physicContainer.setVelocity(x, y);
  }
  setPosition(x: number, y: number): void {
    this._container.setPosition(x, y);
  }

  private initCollisions() {
    const body = this.scene.matter.body.create({
      parts: [this.matterBody, this.groundCollisionDetector.body],
    });
    this._physicContainer.setExistingBody(body);
    this.matterBody.collisionFilter = body.collisionFilter = {
      category: CollisionCategory.Player,
      group: CollisionGroups.Player,
      mask: CollisionCategory.StaticEnvironment | CollisionCategory.WorldBounds,
    };
  }

  destroy() {
    try {
      this._physicContainer.destroy();
      this._container.removeAll();
      this._container.destroy();
      super.destroy();
    } catch (error) {}
  }

  public get matterBody() {
    return this._container.body as BodyType;
  }

  public get view() {
    return this._view;
  }

  public get onGroundCollideChange(): Observable<boolean> {
    return this.groundCollisionDetector.onCollideChange;
  }
}
