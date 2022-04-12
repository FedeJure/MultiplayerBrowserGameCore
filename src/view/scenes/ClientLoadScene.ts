import { Scene } from "phaser";
import { AssetsConfiguration } from "../../infrastructure/configuration/AssetsConfiguration";
import { AssetLoader } from "../AssetLoader";
import { SceneNames } from "./SceneNames";

export class ClientLoadScene extends Scene {
  constructor() {
    super('');
  }

  preload(): void {
    AssetsConfiguration.spines.forEach((s) => {
      this.load.spine(
        s.key,
        AssetLoader.resolveAssetPath(s.jsonPath),
        AssetLoader.resolveAssetPath(s.atlasPath)
      );
    });
    AssetsConfiguration.spritesheets.forEach((ss) => {
      this.load.spritesheet({ ...ss, url: AssetLoader.resolveAssetPath(ss.path) });
    });
    AssetsConfiguration.images.forEach((image) => {
      this.load.image({ ...image, url: AssetLoader.resolveAssetPath(image.path) });
    });
    this.load.once("complete", () => this.scene.launch(SceneNames.MainScene));
  }
}
