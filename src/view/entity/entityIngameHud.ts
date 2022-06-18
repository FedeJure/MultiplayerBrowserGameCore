import { GameObjects, Scene } from "phaser";
import { SceneNames } from "../scenes/SceneNames";
import { HtmlEntityStatus, StatusUi } from "../ui/HtmlEntityStatus";
import { HtmlLocalPlayerStatus } from "../ui/HtmlLocalPlayerStatus";
export class EntityIngameHud extends GameObjects.Container {
  private entityStatus: StatusUi;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number,
    showPinnedOnScren: boolean
  ) {
    super(scene, x, y);
    this.setSize(width, 0);
    this.entityStatus = showPinnedOnScren
      ? new HtmlLocalPlayerStatus()
      : new HtmlEntityStatus(width);
    if (showPinnedOnScren) {
      scene.scene
        .get(SceneNames.ClientHudScene)
        .add.dom(0, 0, this.entityStatus.element)
        .setOrigin(0, 0);
    }
    this.add(scene.add.dom(0, 0, this.entityStatus.element).setScale(1,1));

    scene.add.existing(this);
  }

  setDisplayName(name: string) {
    this.entityStatus.setName(name);
  }

  setLifePercent(percent: number) {
    this.entityStatus.setLifePercent(percent);
  }

  setLevel(level: number) {
    this.entityStatus.setLevel(level);
  }
}
