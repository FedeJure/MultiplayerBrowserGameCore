import { GameObjects, Scene } from "phaser";
import { EnemySpawner } from "../../domain/enemies/EnemySpawner";
import { FontSize, FONT_RESOLUTION } from "../Fonts";
import { LifeBar } from "../player/lifeBar";
import { HtmlEntityStatus } from "../ui/HtmlEntityStatus";
import { HtmlMoneyView } from "../ui/HtmlMoneyView";
export class EntityIngameHud extends GameObjects.Container {
  private nameText: GameObjects.Text;
  private lifeBar: LifeBar;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(scene, x, y);
    this.setSize(width, 0);
    // this.nameText = scene.add.text(0, 0, "Federico Jure", {
    //   resolution: FONT_RESOLUTION,
    //   align: "left",
    //   fixedWidth: width,
    // });

    // this.add(
    //   scene.add
    //     .rectangle(
    //       0,
    //       0,
    //       width * 1.05,
    //       10,
    //       Phaser.Display.Color.HexStringToColor("#b08e6b").color,
    //       0.5
    //     )
    //     .setOrigin(0.5, 1.3)
    // );
    this.add(scene.add.dom(0,-height / 4,new HtmlEntityStatus(width).element))
    // this.add([
    //   scene.add
    //     .rectangle(
    //       width * 0.75,
    //       0,
    //       10,
    //       10,
    //       Phaser.Display.Color.HexStringToColor("#b08e6b").color,
    //       0.5
    //     )
    //     .setOrigin(0, 1.3)
    // ])

    // this.nameText
    //   .setFontSize(FontSize.SMALL)
    //   .setFontStyle("bold")
    //   .setOrigin(0.5, 1.5);

    this.lifeBar = new LifeBar(this.scene, 0, 0, 40);
    // this.add([this.nameText, this.lifeBar]);

    scene.add.existing(this);
  }

  setDisplayName(name: string) {
    // this.nameText.setText(name);
  }

  setLifePercent(percent: number) {
    // this.lifeBar.setPercent(percent);
  }
}
