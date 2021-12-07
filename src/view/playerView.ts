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
  protected readonly view: Physics.Matter.Sprite;

  constructor(
    view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view.scene, "player");
    this.view = view;
    this.view.scene.matter.add.gameObject(view);
    this.view.setBounce(0);
    this.initCollisions();
  }
  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this.view);
  }
  playAnimation(anim: string): void {
  }
  get velocity(): MatterJS.Vector {
    return this.view.body.velocity;
  }
  get position(): MatterJS.Vector {
    return this.view.body.position;
  }
  setScale(x: number, y: number): void {
    this.view.setScale(x, y);
  }
  lookToLeft(value: boolean): void {
    this.view.setScale(
      (value ? -1 : 1) * Math.abs(this.view.scaleX),
      this.view.scaleY
    );
  }
  setVelocity(x: number, y: number): void {
    this.view.setVelocity(x, y);
  }
  setPosition(x: number, y: number): void {
    this.view.setPosition(x, y);
  }

  private initCollisions() {
    this.view.setCollisionCategory(CollisionCategory.Player);
    this.view.setCollidesWith([CollisionCategory.StaticEnvironment]);
  }

  destroy() {
    this.view.destroy();
    this.scene.matter.world.remove(this.view);
  }

  preUpdate(time: number, delta: number) {
    this._onPreUpdate.next({ time, delta });
  }

  update(time: number, delta: number) {
    if (this.view.active) {
      this.view.update(time, delta);
      this.view.setAngle(0); //Prevents to gameobject rotate due Matter physics. Cant find another solution at the moment
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
    return this.view.body as BodyType;
  }
}
