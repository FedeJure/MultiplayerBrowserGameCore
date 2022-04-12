import { SceneNames } from "./SceneNames";

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: "loadScene",
    });
  }

  preload() {
    this.scene.launch(SceneNames.MainScene)
  }

  create() {
  }
}
