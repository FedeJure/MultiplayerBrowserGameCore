import { BodyType, Composite, Vector } from "matter";
import { GameObjects, Physics } from "phaser";
import { AnimationCode } from "../domain/animations/animations";
import { PlayerView } from "./playerView";
import { GameScene } from "./scenes/GameScene";

export class ClientPlayerView extends PlayerView {
  private readonly spine: SpineGameObject;
  private readonly nameText: GameObjects.Text;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    const spine = scene.add.spine(x, y, "hero", AnimationCode.IDLE, true);
    const currentSize: Vector = spine.getBounds().size;
    const factor = currentSize.y / height;

    spine.setDisplaySize(currentSize.x / factor + 10, height + 10).refresh();
    spine.setSize(width, height);
    spine.setOffset(0, 10);
    const viewAsSprite = spine as unknown as Physics.Matter.Sprite;
    super(viewAsSprite, x, y, height, width);

    this.nameText = scene.add.text(x, y, "Karim", {
      fontSize: "2",
      resolution: 20,
    });
    this.nameText.setDepth(10)
    const nameBody = scene.matter.add.gameObject(this.nameText, {
      ignoreGravity: true,
      isSensor: true,
    }).body as BodyType;
    this.nameText.displayOriginY = 40;
    scene.matter.add.joint(this.matterBody, nameBody);
    this.spine = spine;
  }

  playAnimation(anim: string) {
    this.spine.setAnimation(0, anim, true, true);
  }

  setDisplayName(): void {}
}
