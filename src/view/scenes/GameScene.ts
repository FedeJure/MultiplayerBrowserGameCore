import { Scene } from "phaser";
import { SceneNames } from "./SceneNames";

export class GameScene extends Scene {
  constructor() {
    super({
      key: SceneNames.MainScene,
    });
  }
}