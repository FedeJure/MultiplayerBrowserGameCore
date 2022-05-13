import { Physics, Scene } from "phaser";
import { EnemyAnimation } from "../../domain/enemies/EnemyAnimations";
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
    const spine = scene.add.spine(x, y, name, initialAnimation, true);
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;

    super(viewAsSprite, x, y, height, width);
    this.spine = spine;
  }
}
