import { GameObjects, Physics } from "phaser";
import { v4 as uuidv4 } from "uuid";
import { EntityView } from "../../domain/entity/entityView";
import { AnimationDto } from "../../domain/entity/AnimationDto";
import { Vector } from "../../domain/vector";
import { ExistentDepths } from "../existentDepths";
import { PhaserCombatCollisionResolver } from "../player/combatCollisionResolver";
import { ViewObject, ViewObjectType } from "../../domain/viewObject";

export class PhaserEntityView
  extends Phaser.GameObjects.Container
  implements EntityView, ViewObject
{
  constructor(
    readonly view: Physics.Arcade.Sprite | SpineGameObject,
    x: number,
    y: number,
    height: number,
    width: number,
    protected collisionResolver?: PhaserCombatCollisionResolver
  ) {
    super(view.scene, x, y, [view as GameObjects.GameObject]);
    view.setPosition(0, 0);
    this.setSize(width, height);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setDepth(ExistentDepths.GROUND);
    this.arcadeBody.setFriction(100, 100);
    this.arcadeBody.setBounce(0, 0);
    this.initCollisions();
    this.setData("id", uuidv4());
    this.setData("type", ViewObjectType.Entity);
  }

  get id() {
    return this.getData("id");
  }

  get viewType() {
    return this.getData("type");
  }

  get grounded() {
    return this.arcadeBody.touching.down;
  }

  setVelocity(x: number, y: number): void {
    this.arcadeBody.setVelocity(x, y);
  }

  get arcadeBody() {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  setPositionInTime(x: number, y: number, time: number) {
    this.scene.tweens.add({
      targets: this,
      duration: time,
      x,
      y,
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
    return this.arcadeBody.velocity;
  }

  lookToLeft(value: boolean): void {
    this.view.setScale(
      (value ? -1 : 1) * Math.abs(this.view.scaleX),
      this.view.scaleY
    );
  }

  get positionVector(): Vector {
    return { x: this.x, y: this.y };
  }

  private initCollisions() {
    this.arcadeBody.setAllowRotation(false);
  }

  get blocked(): boolean {
    return this.arcadeBody.blocked.left || this.arcadeBody.blocked.right;
  }

  setCollisionResolver(collisionResolver: PhaserCombatCollisionResolver) {
    this.collisionResolver = collisionResolver;
    return this;
  }

  startFollowWithCam(): void {
    this.scene.cameras.main.startFollow(this, false, 0.1, 0.1);
  }
}
