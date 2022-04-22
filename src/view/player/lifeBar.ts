import { GameObjects } from "phaser";

enum LifeColors {
  full = "#00FF3A",
  middle = "#FFD500",
  low = "#FF0000",
}

export class LifeBar extends GameObjects.Container {
  private fullColor = Phaser.Display.Color.HexStringToColor("00FF3A").color;
  private middleColor = Phaser.Display.Color.HexStringToColor("FFD500").color;
  private lowColor = Phaser.Display.Color.HexStringToColor("FF0000").color;

  constructor(scene: Phaser.Scene, x: number, y: number, width:number) {
    super(scene, x, y);
    const background = scene.add.rectangle(0, 0, width, width / 10);
    const life = scene.add.rectangle(0, 0, width, width / 10, this.fullColor);

    this.add([background, life])
  }
}
