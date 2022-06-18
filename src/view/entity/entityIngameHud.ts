import { GameObjects, Scene } from "phaser";
import { HtmlEntityStatus } from "../ui/HtmlEntityStatus";
export class EntityIngameHud extends GameObjects.Container {
  private entityStatus: HtmlEntityStatus;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(scene, x, y);
    this.setSize(width, 0);
    this.entityStatus = new HtmlEntityStatus(width);
    this.add(scene.add.dom(0, 0, this.entityStatus.element));

    scene.add.existing(this);
  }

  setDisplayName(name: string) {
    this.entityStatus.setName(name);
  }

  setLifePercent(percent: number) {
    this.entityStatus.setLifePercent(percent);
  }
}
