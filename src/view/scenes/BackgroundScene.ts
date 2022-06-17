import { Scene } from "phaser";
import { SceneNames } from "./SceneNames";

export class BackgroundScene extends Scene {
  constructor() {
    super({ key: SceneNames.BackgroundScene });
  }

}
