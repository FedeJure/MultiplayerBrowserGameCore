import { Scene } from "phaser";
import { AssetsConfiguration } from "../../infrastructure/configuration/AssetsConfiguration";
import { SceneNames } from "./SceneNames";

export class ClientLoadScene extends Scene {
  constructor(private originUrl: string) {
    super(originUrl);
  }

  preload(): void {
    AssetsConfiguration.spines.forEach((s) => {
      this.load.spine(
        s.key,
        `${this.originUrl}/${s.jsonPath}`,
        `${this.originUrl}/${s.atlasPath}`
      );
    });
    AssetsConfiguration.spritesheets.forEach((ss) => {
      this.load.spritesheet({ ...ss, url: `${this.originUrl}/${ss.path}` });
    });
    AssetsConfiguration.images.forEach((image) => {
      this.load.image({ ...image, url: `${this.originUrl}/${image.path}` });
    });
    this.load.once("complete", () => this.scene.launch(SceneNames.MainScene));
  }
}
