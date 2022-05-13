import { Physics, Scene } from "phaser";
import { EnemyAnimation } from "../../domain/enemies/EnemyAnimations";
import { Vector } from "../../domain/vector";
import { PhaserEnemyView } from "./phaserEnemyView";

export class ClientPhaserEnemyView extends PhaserEnemyView {
  private spine: SpineGameObject;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    name: string,
    initialAnimation: EnemyAnimation
  ) {
    const spine = scene.add.spine(x, y, "hero", initialAnimation, true);
    const currentSize: Vector = spine.getBounds().size;
    const factor = currentSize.y / height;
    spine.setDisplaySize(currentSize.x / factor + 10, height + 10);
    spine.setSize(width, height);
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;

    super(viewAsSprite, x, y, height, width);
    this.spine = spine;
  }
}
