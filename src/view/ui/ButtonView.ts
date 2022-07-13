import { GameObjects, Scene } from "phaser";
import { Observable, Subject } from "rxjs";

export class ButtonView {
  private button: GameObjects.GameObject;
  private _isDown: boolean = false
  private _onClick = new Subject<void>()
  constructor(x: number, y: number,width: number, height: number, scene: Scene) {
    scene.input.addPointer(2)
    this.button = scene.add
      .rectangle(
        x,
        y,
        width,
        height,
        Phaser.Display.Color.HexStringToColor("#ff0").color
      )
      .on('pointerdown', () => {
        if (!this.isDown) this._onClick.next()
        this._isDown = true
      })
      .on('pointerup', () => this._isDown = false).setInteractive()
  }

  get isDown() {
    return this._isDown
  }

  get onClick(): Observable<void> {
    return this._onClick
  }
}
