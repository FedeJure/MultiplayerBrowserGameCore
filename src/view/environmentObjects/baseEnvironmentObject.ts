import { GameObjects, Scene } from "phaser";

export class BaseEnvironmentObject extends GameObjects.GameObject {
  private physicView: Phaser.Physics.Matter.Sprite
  constructor(
    scene: Scene,
    private view: GameObjects.Sprite
  ) {
    super(scene, "Environment Object");
    this.physicView = scene.matter.add.gameObject(view, {
      ignoreGravity: true,
      isStatic: true,
    }) as Phaser.Physics.Matter.Sprite;
    console.log(view,this.physicView)
  }

  destroy(fromScene?: boolean): void {
      this.physicView.destroy(fromScene)
      this.view.destroy(fromScene)
      super.destroy(fromScene)
  }
}
