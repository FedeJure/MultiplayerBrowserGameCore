import { GameObjects, Types } from "phaser";
import { Observable, Subject } from "rxjs";
import { IPlayerView } from "../presentation/playerView";

export class PlayerView extends GameObjects.GameObject implements IPlayerView {
  //TODO: ver de crear interfaces en el dominio con todas las propiedades q se usen de Phaser, para aislar
  // el core de la dependencia del framework
  private readonly _onUpdate = new Subject<{ time: number; delta: number }>();
  private readonly _onPreUpdate = new Subject<{
    time: number;
    delta: number;
  }>();
  protected readonly _view: Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(
    view:  Types.Physics.Arcade.SpriteWithDynamicBody,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view.scene, "player");
    view.setDepth(10)
    this._view = view
    this._view.scene.physics.add.existing(view);
    this._view.body.setBounce(0,0)
    
    this._view.body.setSize(width,height, true)
    this._view.body.setOffset(0.5, 0.5)
    this._view.body.setCollideWorldBounds(true);

    const col = this.scene.physics.add.existing(this.scene.add.rectangle(85, 400, 1000, 10, 0xff0000), true)
    
    this.scene.physics.add.collider(col, this._view,(w,e) => {
      
    })
    
    
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
  get velocity(): Phaser.Math.Vector2 {
    return this._view.body.velocity;
  }
  get position(): Phaser.Math.Vector2 {
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
    this.matterBody.setVelocity(x, y);
  }
  setPosition(x: number, y: number): void {
    this._view.setPosition(x, y);
  }

  private initCollisions() {
    // this._view.setCollisionCategory(CollisionCategory.Player);
    // this._view.setCollidesWith([CollisionCategory.StaticEnvironment]);
  }

  destroy() {
    this._view.destroy();
  }

  preUpdate(time: number, delta: number) {
    this._onPreUpdate.next({ time, delta });
  }

  update(time: number, delta: number) {
    if (this._view.active) {
      this._view.update(time, delta);
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
    return this._view.body
  }

  public get view() {
    return this._view;
  }
}
