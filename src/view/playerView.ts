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
  protected readonly _view: Physics.Matter.Sprite;

  constructor(
    view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view.scene, "player");
    this._view = view;
    this._view.scene.matter.add.gameObject(view, { chamfer: { radius: 5 } });
    this._view.setBounce(0);
    this.initCollisions();
  }
  moveTo(x: number, y: number, time: number): void {
    this.view.scene.tweens.add({
      targets: this.view,
      x,
      y,
      duration: time,
    });
  }
  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this._view);
  }
  playAnimation(anim: string): void {}
  get velocity(): MatterJS.Vector {
    return this._view.body.velocity;
  }
  get position(): MatterJS.Vector {
    return this._view.body.position;
  }
  setScale(x: number, y: number): void {
    this._view.setScale(x, y);
  }
  lookToLeft(value: boolean): void {
    this._view.setScale(
      (value ? -1 : 1) * Math.abs(this._view.scaleX),
      this._view.scaleY
    );
  }
  setVelocity(x: number, y: number): void {
    this._view.setVelocity(x, y);
  }
  setPosition(x: number, y: number): void {
    this._view.setPosition(x, y);
  }

  private initCollisions() {
    this._view.setCollisionCategory(CollisionCategory.Player);
    this._view.setCollidesWith([CollisionCategory.StaticEnvironment]);
  }

  destroy() {
    this._view.destroy();
    this.scene.matter.world.remove(this._view);
  }

  preUpdate(time: number, delta: number) {
    this._onPreUpdate.next({ time, delta });
  }

  update(time: number, delta: number) {
    if (this._view.active) {
      this._view.update(time, delta);
      this._view.setAngle(0); //Prevents to gameobject rotate due Matter physics. Cant find another solution at the moment
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
    return this._view.body as BodyType;
  }

  public get view() {
    return this._view;
  }
}
