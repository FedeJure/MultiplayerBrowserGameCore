import { Scene } from "phaser";

export class TransitionView {
  private readonly fadeDuration = 2000;
  constructor(private scene: Scene) {}

  fadeOff() {
    this.scene.cameras.cameras.forEach((c, i) => {
      c.fadeOut(this.fadeDuration, 0, 0, 0, (_, value) => {
        this.scene.game.domContainer.style.opacity = value.toString();
      });
    });
  }

  fadeIn() {
    this.scene.cameras.cameras.forEach((c, i) => {
      c.fadeIn(this.fadeDuration, 0, 0, 0, (_, value) => {
        this.scene.game.domContainer.style.opacity = value.toString();
      });
    });
  }
}
