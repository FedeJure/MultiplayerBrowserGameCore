import { BodyType } from "matter";
import { GameObjects, Physics } from "phaser";
import { Observable, Subject } from "rxjs";
import { CollisionCategory } from "../domain/collisions/collisionTypes";
import { IPlayerView } from "../presentation/playerView";

export class PlayerView extends GameObjects.GameObject implements IPlayerView {
  //TODO: ver de crear interfaces en el dominio con todas las propiedades q se usen de Phaser, para aislar
  // el core de la dependencia del framework
  private readonly _onUpdate = new Subject<{ time: number; delta: number }>();
  private readonly _onPreUpdate = new Subject<{
    time: number;
    delta: number;
  }>();
  protected readonly _container: GameObjects.Container;
  protected readonly _physicContainer: Physics.Matter.Sprite &
    GameObjects.Container;
  protected readonly _view: Physics.Matter.Sprite;
  public readonly body: BodyType;

  constructor(
    view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view.scene, "player");
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

    this.initCollisions();
  }
  add(children: GameObjects.GameObject): this {
    this._physicContainer.add(children);
    return this;
  }
  get gameObject(): GameObjects.GameObject {
    return this._container;
  }
  moveTo(x: number, y: number, time: number): void {
    this.view.scene.tweens.add({
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
    this._physicContainer.setCollisionCategory(CollisionCategory.Player);
    this._physicContainer.setCollidesWith([
      CollisionCategory.StaticEnvironment,
      CollisionCategory.WorldBounds,
    ]);
  }

  destroy() {
    this._container.destroy();
    this.scene.matter.world.remove(this._container);
  }

  preUpdate(time: number, delta: number) {
    if (this._container.active) {
      this._onPreUpdate.next({ time, delta });
    }
  }

  update(time: number, delta: number) {
    if (this._container.active) {
      this._container.update(time, delta);
      this._container.setAngle(0); //Prevents to gameobject rotate due Matter physics. Cant find another solution at the moment
      this._onUpdate.next({ time, delta });
    }
  }

  public get onUpdate(): Observable<{ time: number; delta: number }> {
    return this._onUpdate;
  }
  public get onPreUpdate(): Observable<{ time: number; delta: number }> {
    return this._onPreUpdate;
  }

  public get matterBody() {
    return this._container.body as BodyType;
  }

  public get view() {
    return this._view;
  }
}
