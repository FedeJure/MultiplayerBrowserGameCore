import Phaser, { Physics } from "phaser";
import { v4 as uuidv4 } from "uuid";
import { EntityView } from "../../domain/entity/entityView";
import { AnimationDto } from "../../domain/entity/AnimationDto";
import { Vector } from "../../domain/vector";
import { ExistentDepths } from "../existentDepths";
import { PhaserCombatCollisionResolver } from "../player/combatCollisionResolver";
import { ViewObject, ViewObjectType } from "../../domain/viewObject";
import { Entity } from "../../domain/entity/entity";
import { Side } from "../../domain/side";

export class PhaserEntityView
  extends Phaser.GameObjects.Container
  implements EntityView, ViewObject
{
  private currentTween: Phaser.Tweens.Tween | undefined
  constructor(
    readonly view: Physics.Arcade.Sprite | SpineGameObject,
    x: number,
    y: number,
    height: number,
    width: number,
    protected collisionResolver?: PhaserCombatCollisionResolver
  ) {
    super(view.scene, x, y);
    this.setSize(width, height);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setDepth(ExistentDepths.ENTITIES);
    this.arcadeBody.setFriction(100, 100);
    this.arcadeBody.setBounce(0, 0);
    this.arcadeBody.setDrag(0, 0);
    this.initCollisions();
    this.setData("id", uuidv4());
    this.setData("type", ViewObjectType.Entity);
    this.arcadeBody.onOverlap = true;
    
  }

  setAllowGravity(value: boolean) {
    this.arcadeBody.setAllowGravity(value);
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

  get falling() {
    return this.arcadeBody.velocity.y  > 3
  }

  setVelocity(x: number, y: number): void {
    this.arcadeBody.setVelocity(x, y);
  }

  get arcadeBody() {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  die() {}

  setPositionInTime(x: number, y: number, time: number) {
    try {
      if (this.currentTween && this.currentTween.progress < 1) this.currentTween.stop()
      const distance = Phaser.Math.Distance.Between(x,y, this.x, this.y)
      // this.scene.physics.moveTo(this,x,y,distance * 1000 / time )
      this.currentTween = this.scene.tweens.add({
        targets: this,
        duration: time,
        x: {from: this.x, to: x},
        y: {from: this.y, to: y},
        ease: Phaser.Math.Easing.Linear
      });
    } catch (error) { 
    }
  }
  getEntitiesClose(distance: number) {
    return (
      this.collisionResolver?.getTargetsAround(this.x, this.y, distance) ?? []
    );
  }
  playAnimations(anims: AnimationDto[]): void {}
  setLifePercent(percent: number): void {}
  setLevel(level: number): void {}
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

  get side() {
    return this.view.scaleX > 0 ? Side.RIGHT : Side.LEFT 
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

  setEntityReference(entity: Entity) {
    this.setData("entity", entity);
  }

  getEntitiesOnArea<T extends Entity>(
    x: number,
    y: number,
    width: number,
    height: number
  ): T[] {
    const bodies = this.scene.physics.overlapRect(
      x,
      y,
      width,
      height,
      true,
      false
    ) as Physics.Arcade.Body[];
    return bodies
      .filter((b) => b.gameObject.getData("entity"))
      .map((b) => b.gameObject.getData("entity") as T);
  }
}
