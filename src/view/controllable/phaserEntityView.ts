import { BodyType } from "matter";
import { GameObjects, Physics } from "phaser";
import { EntityView } from "../../domain/entity/entityView";
import { Vector } from "../../domain/vector";

export class PhaserEntityView
  extends GameObjects.Container
  implements EntityView
{
  constructor(
    readonly view: Physics.Matter.Sprite,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(view.scene, x, y, [view]);
    this.setSize(width, height);
    this.setDisplaySize(width, height);
    this.scene.add.existing(this);
    view.displayOriginX = 0;
    view.displayOriginY = 0;
    view.setPosition(0, 0);
  }
  get velocity() {
    return this.matterBody.velocity
  };

  protected get selfAsPhysic() {
    return this as unknown as Phaser.Physics.Matter.Sprite &
      GameObjects.Container;
  }

  get matterBody() {
    return this.body as BodyType;
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
}
