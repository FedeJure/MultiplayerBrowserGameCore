import { GameObjects } from "phaser";

enum LifeColors {
  full = "#00FF3A",
  middle = "#FFD500",
  low = "#FF0000",
}

export class LifeBar extends GameObjects.Container {
  private fullColor = Phaser.Display.Color.HexStringToColor(LifeColors.full).color;
  private middleColor = Phaser.Display.Color.HexStringToColor(LifeColors.middle).color;
  private lowColor = Phaser.Display.Color.HexStringToColor(LifeColors.low).color;
  private maxWidth: number;
  private lifeBar: GameObjects.Rectangle
  constructor(scene: Phaser.Scene, x: number, y: number, width: number) {
    super(scene, x, y);
    this.maxWidth = width;
    const background = scene.add.rectangle(0, 0, width, width / 10, Phaser.Display.Color.HexStringToColor('CBC7C7').color, 0.7) ;
    const foreground = scene.add.rectangle(0, 0, width, width / 10) ;
    this.lifeBar = scene.add.rectangle(0, 0, width, width / 10, this.fullColor);
    foreground.strokeColor = Phaser.Display.Color.HexStringToColor('000000').color
    foreground.isStroked = true
    foreground.strokeAlpha = 0.8
    this.add([background, this.lifeBar, foreground]);
  }

  setPercent(_percent: number) {
    const percent = Math.min(100, Math.max(0, _percent));
    const newWidth = this.maxWidth * (percent / 100)
    let color = this.middleColor
    if (percent > 65) color = this.fullColor
    else if (percent < 20) color = this.lowColor
    this.lifeBar.fillColor = color
    this.lifeBar.setSize(newWidth, this.lifeBar.height)
  }
}
